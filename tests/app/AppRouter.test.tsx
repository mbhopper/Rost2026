import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AppRouter } from '../../src/app/router/AppRouter';
import { routes } from '../../src/shared/config/routes';
import { buildRequestSuccessPath } from '../../src/shared/lib/requestId';
import {
  clearBrowserState,
  createAdminAuthenticatedState,
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

  it('completes the login flow and navigates to the user dashboard', async () => {
    resetAppStore({
      ...createAuthenticatedState(),
      authStatus: 'guest',
      currentRole: null,
      user: null,
    });
    window.location.hash = `#${routes.login}`;

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderWithRouter(<AppRouter />);

    await user.clear(screen.getByLabelText('Email'));
    await user.type(
      screen.getByLabelText('Email'),
      'alex.ivanov@futurepass.app',
    );
    await user.clear(screen.getByLabelText('Пароль'));
    await user.type(screen.getByLabelText('Пароль'), 'future-pass');
    await user.click(screen.getByRole('button', { name: 'Войти' }));

    await vi.advanceTimersByTimeAsync(320);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.dashboard}`);
    });

    expect(
      await screen.findByRole('heading', {
        name: /александр, ваш цифровой пропуск готов/i,
      }),
    ).toBeInTheDocument();
  });

  it('opens register success directly via hash-router URL and reads requestId from search params', async () => {
    resetAppStore({
      authStatus: 'guest',
      isAuthBootstrapped: true,
      currentRole: null,
      user: null,
      passes: [],
      qrSession: null,
    });
    window.location.hash = `#${buildRequestSuccessPath(routes.registerSuccess, 'request-direct-123')}`;

    renderWithRouter(<AppRouter />);

    expect(
      screen.getByRole('heading', {
        name: /заявка на регистрацию отправлена/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Номер заявки: request-direct-123'),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe(
      `#${buildRequestSuccessPath(routes.registerSuccess, 'request-direct-123')}`,
    );
  });

  it('opens support success directly via hash-router URL and reads requestId from search params', async () => {
    resetAppStore({
      authStatus: 'guest',
      isAuthBootstrapped: true,
      currentRole: null,
      user: null,
      passes: [],
      qrSession: null,
    });
    window.location.hash = `#${buildRequestSuccessPath(routes.supportSuccess, 'support-direct-456')}`;

    renderWithRouter(<AppRouter />);

    expect(
      screen.getByRole('heading', {
        name: /заявка в службу поддержки отправлена/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Номер обращения: support-direct-456'),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe(
      `#${buildRequestSuccessPath(routes.supportSuccess, 'support-direct-456')}`,
    );
  });

  it('opens the standalone support page for guests without redirecting', async () => {
    resetAppStore({
      authStatus: 'guest',
      isAuthBootstrapped: true,
      currentRole: null,
      user: null,
      passes: [],
      qrSession: null,
    });
    window.location.hash = `#${routes.support}`;

    renderWithRouter(<AppRouter />);

    expect(
      screen.getByRole('heading', { name: /обратная связь/i }),
    ).toBeInTheDocument();
    expect(window.location.hash).toBe(`#${routes.support}`);
  });

  it('redirects guests away from protected user routes to login', async () => {
    resetAppStore({
      ...createAuthenticatedState(),
      authStatus: 'guest',
      currentRole: null,
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

  it('redirects guests away from admin routes to admin login', async () => {
    resetAppStore({
      authStatus: 'guest',
      isAuthBootstrapped: true,
      currentRole: null,
      user: null,
      passes: [],
      qrSession: null,
    });
    window.location.hash = `#${routes.adminDashboard}`;

    renderWithRouter(<AppRouter />);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.adminLogin}`);
    });

    expect(
      screen.getByRole('heading', { name: /панель администрирования/i }),
    ).toBeInTheDocument();
  });

  it('redirects regular users away from admin routes to unauthorized', async () => {
    resetAppStore(createAuthenticatedState());
    window.location.hash = `#${routes.adminDashboard}`;

    renderWithRouter(<AppRouter />);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.unauthorized}`);
    });
  });

  it('allows admin login flow to reach admin dashboard', async () => {
    resetAppStore({
      ...createAdminAuthenticatedState(),
      authStatus: 'guest',
      currentRole: null,
      user: null,
    });
    window.location.hash = `#${routes.adminLogin}`;

    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    renderWithRouter(<AppRouter />);

    await user.clear(screen.getByLabelText('Email'));
    await user.type(screen.getByLabelText('Email'), 'admin@futurepass.app');
    await user.clear(screen.getByLabelText('Пароль'));
    await user.type(screen.getByLabelText('Пароль'), 'admin-pass');
    await user.click(screen.getByRole('button', { name: /admin panel/i }));

    await vi.advanceTimersByTimeAsync(320);
    await vi.advanceTimersByTimeAsync(180);

    await waitFor(() => {
      expect(window.location.hash).toBe(`#${routes.adminDashboard}`);
    });

    expect(
      screen.getByRole('heading', { name: /мониторинг цифровых пропусков/i }),
    ).toBeInTheDocument();
  });
});
