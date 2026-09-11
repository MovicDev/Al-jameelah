import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import * as authService from './services/authService';
import * as profileService from './services/profileService';
import { AUTH_SESSION_CLEARED_EVENT } from './services/sessionStore';
import type { AuthState, AuthView, Profile, RegistrationInput, Session, SignUpResult } from './types';

interface AuthContextValue extends AuthState {
  authError: string | null;
  authNotice: string | null;
  isAuthModalOpen: boolean;
  authView: AuthView;
  openAuth: (view?: AuthView) => void;
  closeAuth: () => void;
  setAuthView: (view: AuthView) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (input: RegistrationInput) => Promise<SignUpResult>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (password: string) => Promise<void>;
  saveProfile: (fullName: string) => Promise<Profile>;
  saveAvatar: (avatar: File) => Promise<Profile>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const user = session?.user ?? null;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [recoveryToken, setRecoveryToken] = useState('');
  const noticeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showAuthNotice = useCallback((message: string) => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
    setAuthNotice(message);
    noticeTimer.current = setTimeout(() => setAuthNotice(null), 4000);
  }, []);

  useEffect(() => () => {
    if (noticeTimer.current) clearTimeout(noticeTimer.current);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      setProfile(await profileService.getProfile());
      setAuthError(null);
    } catch (error) {
      setProfile(null);
      setAuthError(error instanceof Error ? error.message : 'Your profile could not be loaded.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    const callbackParams = new URLSearchParams(window.location.search);
    const resetToken = callbackParams.get('reset_token');
    if (resetToken) {
      setRecoveryToken(resetToken);
      setAuthView('reset-password');
      setIsAuthModalOpen(true);
    }

    void authService.restoreSession()
      .then((restored) => {
        if (!active) return;
        setSession(restored);
        if (restored) void refreshProfile();
      })
      .catch((error) => {
        if (active) setAuthError(authService.toAuthMessage(error));
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [refreshProfile]);

  useEffect(() => {
    const clearLiveSession = () => {
      setSession(null);
      setProfile(null);
    };
    window.addEventListener(AUTH_SESSION_CLEARED_EVENT, clearLiveSession);
    return () => window.removeEventListener(AUTH_SESSION_CLEARED_EVENT, clearLiveSession);
  }, []);

  const runAuthOperation = async <T,>(operation: () => Promise<T>): Promise<T> => {
    setAuthError(null);
    try {
      return await operation();
    } catch (error) {
      const message = authService.toAuthMessage(error);
      setAuthError(message);
      throw new Error(message);
    }
  };

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    profile,
    isAuthenticated: Boolean(session && user),
    isAdmin: profile?.role === 'admin',
    isLoading,
    authError,
    authNotice,
    isAuthModalOpen,
    authView,
    openAuth: (view = 'login') => { setAuthView(view); setAuthError(null); setIsAuthModalOpen(true); },
    closeAuth: () => setIsAuthModalOpen(false),
    setAuthView: (view) => { setAuthView(view); setAuthError(null); },
    login: async (email, password) => {
      const next = await runAuthOperation(() => authService.signIn(email, password));
      setSession(next); await refreshProfile(); setIsAuthModalOpen(false);
      showAuthNotice(`Welcome back! You are signed in as ${next.user.email}.`);
    },
    register: async (input) => {
      const result = await runAuthOperation(() => authService.signUp(input));
      if (result.session) {
        setSession(result.session); await refreshProfile();
      }
      setIsAuthModalOpen(false);
      showAuthNotice('Account created successfully. Welcome to Al-jameelah World!');
      return result;
    },
    logout: async () => {
      await runAuthOperation(authService.signOut);
      setSession(null); setProfile(null); setIsAuthModalOpen(false);
      showAuthNotice('You have been logged out successfully.');
    },
    forgotPassword: async (email) => {
      await runAuthOperation(() => authService.requestPasswordReset(email));
      showAuthNotice('If the email is registered, a password-reset link has been sent.');
    },
    resetPassword: async (password) => {
      if (!recoveryToken) throw new Error('This password-reset link is invalid.');
      await runAuthOperation(() => authService.updatePassword(recoveryToken, password));
      setRecoveryToken('');
      const url = new URL(window.location.href); url.searchParams.delete('reset_token');
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
      setAuthView('login'); setIsAuthModalOpen(false);
      showAuthNotice('Your password has been reset. You can now sign in.');
    },
    saveProfile: async (fullName) => {
      const next = await profileService.updateProfile(fullName);
      setProfile(next); showAuthNotice('Your profile has been updated.'); return next;
    },
    saveAvatar: async (avatar) => {
      const next = await profileService.uploadAvatar(avatar);
      setProfile(next); showAuthNotice('Your profile photo has been updated.'); return next;
    },
    changePassword: async (currentPassword, newPassword) => {
      await runAuthOperation(() => profileService.changePassword(currentPassword, newPassword));
      showAuthNotice('Your password has been changed successfully.');
    },
    refreshProfile,
  }), [user, session, profile, isLoading, authError, authNotice, isAuthModalOpen, authView, recoveryToken, refreshProfile, showAuthNotice]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
