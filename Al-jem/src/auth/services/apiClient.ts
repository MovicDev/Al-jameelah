import { clearSession, readSession } from './sessionStore';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:4000/api').replace(/\/$/, '');

interface ApiErrorBody {
  error?: {
    code?: string;
    message?: string;
    details?: Array<string | { path?: string; message?: string }>;
  };
}

export class ApiRequestError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'ApiRequestError';
  }
}

export const apiRequest = async <T>(path: string, init?: RequestInit, authenticated = false): Promise<T> => {
  const session = authenticated ? readSession() : null;
  if (authenticated && !session) throw new ApiRequestError(401, 'missing_session', 'Your session has expired. Please sign in again.');

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
      ...(init?.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...init?.headers,
    },
  });

  if (response.status === 204) return undefined as T;
  const body = (await response.json().catch(() => ({}))) as T & ApiErrorBody;
  if (!response.ok) {
    if (response.status === 401 && authenticated) clearSession();
    const firstDetail = body.error?.details?.[0];
    const detailedMessage = typeof firstDetail === 'string' ? firstDetail : firstDetail?.message;
    throw new ApiRequestError(
      response.status,
      body.error?.code ?? 'request_failed',
      detailedMessage ?? body.error?.message ?? 'The server could not complete this request.',
    );
  }
  return body;
};
