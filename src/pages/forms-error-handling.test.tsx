import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SupportPage } from './support/SupportPage';
import { RegisterPage } from './auth/register/RegisterPage';
import { api } from '../shared/api/auth';
import { AppApiError } from '../shared/api/appApi';
import { useAppStore } from '../app/store';
import { buildRequestSuccessPath } from '../shared/lib/requestId';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual =
    await vi.importActual<typeof import('react-router-dom')>(
      'react-router-dom',
    );

  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('form submit error handling', () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    vi.restoreAllMocks();
    useAppStore.setState({ authStatus: 'guest', currentRole: null });
  });

  it('keeps RegisterPage on the form and allows retry after a server error', async () => {
    const submitRegistrationRequest = vi
      .spyOn(api.requestService, 'submitRegistrationRequest')
      .mockRejectedValueOnce(new AppApiError('offline'))
      .mockResolvedValueOnce({
        id: 'request-123',
        status: 'new',
        submittedAt: '2026-03-21T00:00:00.000Z',
        firstName: 'Александр',
        lastName: 'Иванов',
        middleName: '',
        email: 'alex@futurepass.app',
        phone: '+7 (999) 123-45-67',
        department: 'Platform Engineering',
        position: 'Frontend engineer',
        note: 'Нужен доступ в основное здание и переговорные.',
      });

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', {
      name: 'Отправить заявку',
    });

    await userEvent.click(submitButton);

    expect(submitRegistrationRequest).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Нет подключения к сети',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Отправить заявку' }),
    ).toBeEnabled();

    await userEvent.type(screen.getByPlaceholderText('Иван'), 'а');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole('button', { name: 'Отправить заявку' }),
    );

    await waitFor(() => {
      expect(submitRegistrationRequest).toHaveBeenCalledTimes(2);
      expect(mockNavigate).toHaveBeenCalledWith(
        buildRequestSuccessPath('/auth/register/success', 'request-123'),
      );
    });
  });

  it('shows a mapped support error and retries submission without leaving SupportPage', async () => {
    let resolveRequest:
      | ((value: {
          id: string;
          status: 'new' | 'received';
          submittedAt: string;
          email: string;
          topic: string;
          message: string;
        }) => void)
      | null = null;
    const submitSupportRequest = vi
      .spyOn(api.requestService, 'submitSupportRequest')
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            resolveRequest = resolve;
          }),
      )
      .mockRejectedValueOnce(new AppApiError('service_unavailable'))
      .mockResolvedValueOnce({
        id: 'support-456',
        status: 'received',
        submittedAt: '2026-03-21T00:00:00.000Z',
        email: 'help@futurepass.app',
        topic: 'Проблема с проходом',
        message:
          'Не проходит QR на входе в здание, нужна проверка статуса пропуска.',
      });

    render(
      <MemoryRouter>
        <SupportPage />
      </MemoryRouter>,
    );

    const submitButton = screen.getByRole('button', { name: 'Отправить' });
    await userEvent.click(submitButton);

    expect(submitSupportRequest).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Отправляем…' })).toBeDisabled();

    resolveRequest?.({
      id: 'ignored',
      status: 'received',
      submittedAt: '2026-03-21T00:00:00.000Z',
      email: 'help@futurepass.app',
      topic: 'Проблема с проходом',
      message:
        'Не проходит QR на входе в здание, нужна проверка статуса пропуска.',
    });

    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Отправить' })).toBeEnabled();
    });
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(
        buildRequestSuccessPath('/support/success', 'ignored'),
      );
    });

    mockNavigate.mockReset();

    await userEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    expect(submitSupportRequest).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Сервис временно недоступен',
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Отправить' })).toBeEnabled();

    await userEvent.type(screen.getByPlaceholderText('Опишите проблему'), '!');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Отправить' }));

    await waitFor(() => {
      expect(submitSupportRequest).toHaveBeenCalledTimes(3);
      expect(mockNavigate).toHaveBeenCalledWith(
        buildRequestSuccessPath('/support/success', 'support-456'),
      );
    });
  });
});
