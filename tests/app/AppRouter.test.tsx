import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRouter } from '../../src/app/router/AppRouter';
import { routes } from '../../src/shared/config/routes';
import {
  clearBrowserState,
  createAuthenticatedState,
  renderWithRouter,
  resetAppStore,
} from '../helpers/appTestUtils';

describe('AppRouter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-21T10:00:00.000Z'));
    clearBrowserState();
  });

  afterEach(() => {
    resetAppStore();
    vi.useRealTimers();
  });

  it('completes the login flow and navigates to the protected pass page', async () => {
    resetAppStore({
      ...createAuthenticatedState(),
      authStatus: 'guest',
      user: null,
    });
    window.location.hash = `#${routes.login}`;

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderWithRouter(<AppRouter />);

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'alex.ivanov@futurepass.app');
    await user.clear(screen.getByLabelText('Пароль'));
    await user.type(screen.getByLabelText('Пароль'), 'future-pass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await vi.advanceTimersByTimeAsync(320);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.pass}`);
    });

    expect(
      await screen.findByRole('heading', {
        name: /александр, ваш пропуск готов к проходу/i,
      }),
    ).toBeInTheDocument();
  });

  it('redirects guests away from protected routes to login', async () => {
    resetAppStore({
      ...createAuthenticatedState(),
      authStatus: 'guest',
      user: null,
      qrSession: null,
    });
    window.location.hash = `#${routes.pass}`;

    renderWithRouter(<AppRouter />);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.login}`);
    });

    expect(
      screen.getByRole('heading', { name: 'Вход в кабинет пропуска' }),
    ).toBeInTheDocument();
  });
});
