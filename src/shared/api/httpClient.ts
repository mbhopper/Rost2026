import { APP_API_ERROR_CODES, AppApiError } from './appApi';
import { apiConfig, resolveApiUrl } from './config';

export interface RequestInit extends globalThis.RequestInit {}

export interface HttpClient {
  get<T>(path: string, init?: RequestInit): Promise<T>;
  post<T>(path: string, body?: unknown, init?: RequestInit): Promise<T>;
}

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const mapStatusToErrorCode = (status: number) => {
  switch (status) {
    case 400:
      return APP_API_ERROR_CODES.UNKNOWN_ERROR;
    case 401:
      return APP_API_ERROR_CODES.SESSION_EXPIRED;
    case 403:
      return APP_API_ERROR_CODES.INVALID_CREDENTIALS;
    case 404:
      return APP_API_ERROR_CODES.UNKNOWN_ERROR;
    case 409:
      return APP_API_ERROR_CODES.UNKNOWN_ERROR;
    case 423:
      return APP_API_ERROR_CODES.PASS_BLOCKED;
    case 503:
      return APP_API_ERROR_CODES.SERVICE_UNAVAILABLE;
    default:
      return APP_API_ERROR_CODES.UNKNOWN_ERROR;
  }
};

const extractMessage = async (response: Response) => {
  try {
    const payload = (await response.json()) as unknown;

    if (isPlainObject(payload) && typeof payload.message === 'string') {
      return payload.message;
    }
  } catch {
    // ignore malformed error payloads
  }

  return response.statusText || 'Request failed';
};

const parseJson = async <T>(response: Response): Promise<T> => {
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const withTimeout = async (input: string, init: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = globalThis.setTimeout(() => controller.abort(), apiConfig.timeoutMs);

  try {
    const response = await fetch(input, {
      ...init,
      signal: init.signal ?? controller.signal,
    });

    return response;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new AppApiError('service_unavailable', 'Превышено время ожидания ответа сервера.');
    }

    throw new AppApiError('offline');
  } finally {
    globalThis.clearTimeout(timeoutId);
  }
};

const request = async <T>(path: string, init: RequestInit = {}): Promise<T> => {
  const headers = new Headers(apiConfig.defaultHeaders);
  const requestHeaders = new Headers(init.headers ?? undefined);
  requestHeaders.forEach((value, key) => headers.set(key, value));

  const response = await withTimeout(resolveApiUrl(path), {
    ...init,
    headers,
  });

  if (!response.ok) {
    const message = await extractMessage(response);
    throw new AppApiError(mapStatusToErrorCode(response.status), message);
  }

  return parseJson<T>(response);
};

export const httpClient: HttpClient = {
  get(path, init) {
    return request(path, {
      ...init,
      method: 'GET',
    });
  },
  post(path, body, init) {
    const headers = new Headers(init?.headers ?? undefined);

    if (body !== undefined && !headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    return request(path, {
      ...init,
      method: 'POST',
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },
};
