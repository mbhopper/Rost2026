export const APP_API_ERROR_CODES = {
  INVALID_CREDENTIALS: 'invalid_credentials',
  PASS_BLOCKED: 'pass_blocked',
  SERVICE_UNAVAILABLE: 'service_unavailable',
  OFFLINE: 'offline',
  SESSION_EXPIRED: 'session_expired',
  UNKNOWN_ERROR: 'unknown_error',
} as const;

export type AppApiErrorCode =
  (typeof APP_API_ERROR_CODES)[keyof typeof APP_API_ERROR_CODES];

const appApiErrorMessages: Record<AppApiErrorCode, string> = {
  invalid_credentials: 'Неверный email или пароль. Проверьте данные и попробуйте снова.',
  pass_blocked: 'Пропуск заблокирован. Обратитесь в службу безопасности.',
  service_unavailable: 'Сервис временно недоступен. Попробуйте позже.',
  offline: 'Нет подключения к сети. Проверьте интернет и повторите попытку.',
  session_expired: 'Сессия истекла. Войдите заново, чтобы продолжить.',
  unknown_error: 'Произошла непредвиденная ошибка. Попробуйте ещё раз.',
};

export interface AppApiErrorOptions {
  cause?: unknown;
  details?: Record<string, unknown>;
}

export class AppApiError extends Error {
  code: AppApiErrorCode;

  details?: Record<string, unknown>;

  constructor(
    code: AppApiErrorCode,
    message = appApiErrorMessages[code],
    options: AppApiErrorOptions = {},
  ) {
    super(message, { cause: options.cause });
    this.name = 'AppApiError';
    this.code = code;
    this.details = options.details;
  }
}

export const isAppApiError = (error: unknown): error is AppApiError =>
  error instanceof AppApiError;

export const mapAppApiErrorToMessage = (error: unknown): string => {
  if (isAppApiError(error)) {
    return appApiErrorMessages[error.code] ?? error.message;
  }

  return appApiErrorMessages.unknown_error;
};
