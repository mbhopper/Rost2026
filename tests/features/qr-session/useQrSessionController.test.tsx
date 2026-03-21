import { useEffect } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useQrSessionController } from '../../../src/features/qr-session/model';
import { QR_STATUSES } from '../../../src/entities/qr/model';
import { useAppStore } from '../../../src/app/store';
import {
  clearBrowserState,
  createAuthenticatedState,
  createQrSessionFixture,
  resetAppStore,
} from '../../helpers/appTestUtils';

function ControllerHarness({ autoScan = false }: { autoScan?: boolean }) {
  const controller = useQrSessionController();

  useEffect(() => {
    if (!autoScan || controller.state !== 'active') {
      return;
    }

    void controller.scanDemo();
  }, [autoScan, controller]);

  return (
    <div>
      <output data-testid="state">{controller.state}</output>
      <output data-testid="remaining">{controller.remainingSeconds}</output>
      <output data-testid="masked">{String(controller.isScreenMasked)}</output>
    </div>
  );
}

describe('useQrSessionController', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-21T10:00:00.000Z'));
    clearBrowserState();
  });

  afterEach(() => {
    resetAppStore();
    vi.useRealTimers();
  });

  it('transitions active sessions to expired when the countdown elapses', async () => {
    resetAppStore(
      createAuthenticatedState({
        qrSession: createQrSessionFixture({
          expiresAt: '2026-03-21T10:00:01.000Z',
          ttlSeconds: 1,
        }),
      }),
    );

    render(<ControllerHarness />);

    expect(screen.getByTestId('state')).toHaveTextContent('active');
    expect(screen.getByTestId('remaining')).toHaveTextContent('1');

    await vi.advanceTimersByTimeAsync(1_000);
    await vi.advanceTimersByTimeAsync(60);

    await waitFor(() => {
      expect(useAppStore.getState().qrSession?.status).toBe(QR_STATUSES.EXPIRED);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('expired');
    expect(screen.getByTestId('remaining')).toHaveTextContent('0');
  });

  it('transitions active sessions to scanned through the demo action', async () => {
    resetAppStore(
      createAuthenticatedState({
        qrSession: createQrSessionFixture({
          expiresAt: '2026-03-21T10:00:05.000Z',
          ttlSeconds: 5,
        }),
      }),
    );

    render(<ControllerHarness autoScan />);

    await vi.advanceTimersByTimeAsync(80);

    await waitFor(() => {
      expect(useAppStore.getState().qrSession?.status).toBe(QR_STATUSES.SCANNED);
    });

    expect(screen.getByTestId('state')).toHaveTextContent('scanned');
    expect(screen.getByTestId('remaining')).toHaveTextContent('0');
  });
});
