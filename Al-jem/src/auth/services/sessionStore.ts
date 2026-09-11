import type { Session } from '../types';

const SESSION_KEY = 'al_jameelah_session';
export const AUTH_SESSION_CLEARED_EVENT = 'al-jameelah:session-cleared';

const isSession = (value: unknown): value is Session => {
  if (!value || typeof value !== 'object') return false;
  const session = value as Partial<Session>;
  return typeof session.access_token === 'string'
    && typeof session.expires_at === 'number'
    && typeof session.user?.id === 'string'
    && typeof session.user?.email === 'string';
};

export const readSession = (): Session | null => {
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session: unknown = JSON.parse(raw);
    if (!isSession(session) || session.expires_at <= Math.floor(Date.now() / 1000)) {
      clearSession();
      return null;
    }
    return session;
  } catch {
    clearSession();
    return null;
  }
};

export const saveSession = (session: Session) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
};

export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY);
  window.dispatchEvent(new Event(AUTH_SESSION_CLEARED_EVENT));
};
