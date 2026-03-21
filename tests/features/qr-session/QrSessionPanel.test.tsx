import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { QrSessionPanel } from '../../../src/features/qr-session/QrSessionPanel';
import { useAppStore } from '../../../src/app/store';
import { QR_STATUSES } from '../../../src/entities/qr/model';
import {
  clearBrowserState,
  createAuthenticatedState,
  createQrSessionFixture,
  renderWithRouter,
  resetAppStore,
} from '../../helpers/appTestUtils';

describe('QrSessionPanel', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-21T10:00:00.000Z'));
    clearBrowserState();
    resetAppStore(createAuthenticatedState());
  });

  afterEach(() => {
    resetAppStore();
    vi.useRealTimers();
  });

  it('generates a QR session and shows the active status with countdown metadata', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderWithRouter(<QrSessionPanel />);

    await user.click(screen.getByRole('button', { name: /показать qr/i }));
    await vi.advanceTimersByTimeAsync(180);

    await waitFor(() => {
      expect(useAppStore.getState().qrSession?.status).toBe(QR_STATUSES.ACTIVE);
    });

    expect(screen.getAllByText('Пропуск активен')[0]).toBeInTheDocument();
    expect(screen.getByText(/осталось 300 сек\./i)).toBeInTheDocument();
    expect(screen.getByText(/qr-session-/i)).toBeInTheDocument();
  });

  it('expires an active QR session when the TTL reaches zero', async () => {
    resetAppStore(
      createAuthenticatedState({
        qrSession: createQrSessionFixture({
          expiresAt: '2026-03-21T10:00:02.000Z',
          ttlSeconds: 2,
        }),
      }),
    );

    renderWithRouter(<QrSessionPanel />);

    await vi.advanceTimersByTimeAsync(2_000);
    await vi.advanceTimersByTimeAsync(60);

    await waitFor(() => {
      expect(useAppStore.getState().qrSession?.status).toBe(QR_STATUSES.EXPIRED);
    });

    expect(screen.getByText('Код истёк')).toBeInTheDocument();
  });

  it('renders scanned and expired session overlays for persisted statuses', () => {
    resetAppStore(createAuthenticatedState());
    const { rerender } = renderWithRouter(<QrSessionPanel />);

    resetAppStore(
      createAuthenticatedState({
        qrSession: createQrSessionFixture({
          status: QR_STATUSES.SCANNED,
          scannedAt: '2026-03-21T10:00:03.000Z',
          ttlSeconds: 0,
        }),
      }),
    );
    rerender(<QrSessionPanel />);
    expect(screen.getByText('Код использован')).toBeInTheDocument();

    resetAppStore(
      createAuthenticatedState({
        qrSession: createQrSessionFixture({
          status: QR_STATUSES.EXPIRED,
          ttlSeconds: 0,
        }),
      }),
    );
    rerender(<QrSessionPanel />);
    expect(screen.getByText('Код истёк')).toBeInTheDocument();
  });
});
