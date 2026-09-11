import type { AuthUser, RegistrationInput, Session, SignUpResult } from '../types';
import { ApiRequestError, apiRequest } from './apiClient';
import { clearSession, readSession, saveSession } from './sessionStore';

export const toAuthMessage = (error: unknown): string => {
  if (error instanceof ApiRequestError) return error.message;
  const message = error instanceof Error ? error.message.toLowerCase() : '';
  if (message.includes('already exists')) return 'An account already exists for this email.';
  if (message.includes('email or password')) return 'The email or password is incorrect.';
  if (message.includes('password')) return 'The password does not meet the security requirements.';
  if (message.includes('fetch') || message.includes('network')) return 'Unable to reach the authentication service. Check your connection.';
  if (message.includes('not configured')) return error instanceof Error ? error.message : 'Authentication is not configured.';
  return 'Authentication could not be completed. Please try again.';
};

export const signUp = async (input: RegistrationInput): Promise<SignUpResult> => {
  const { session } = await apiRequest<{ session: Session }>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(input),
  });
  saveSession(session);
  return { requiresEmailVerification: false, session };
};

export const signIn = async (email: string, password: string): Promise<Session> => {
  const { session } = await apiRequest<{ session: Session }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
  saveSession(session);
  return session;
};

export const restoreSession = async (): Promise<Session | null> => {
  const session = readSession();
  if (!session) return null;
  try {
    const { user } = await apiRequest<{ user: AuthUser }>('/auth/me', undefined, true);
    const refreshed = { ...session, user };
    saveSession(refreshed);
    return refreshed;
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      clearSession();
      return null;
    }
    throw error;
  }
};

export const signOut = async () => clearSession();

export const requestPasswordReset = async (email: string) => {
  await apiRequest('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
};

export const updatePassword = async (token: string, password: string) => {
  await apiRequest('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
};
