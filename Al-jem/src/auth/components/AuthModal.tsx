import React, { useEffect } from 'react';
import { Lock, X } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { ForgotPasswordForm, ResetPasswordForm } from './RecoveryForms';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';

const headings = {
  login: ['Welcome back', 'Sign in securely to your account.'],
  register: ['Create your account', 'Save your details and manage your profile.'],
  'forgot-password': ['Reset your password', 'We’ll send a secure recovery link.'],
  'reset-password': ['Choose a new password', 'Use a strong password you have not used before.'],
} as const;

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, authView, closeAuth } = useAuth();
  useEffect(() => {
    if (!isAuthModalOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeAuth();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [closeAuth, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;
  const [title, subtitle] = headings[authView];
  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-title"
      onClick={(event) => { if (event.target === event.currentTarget) closeAuth(); }}
    >
      <div
        className="relative w-full max-w-md max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#F0E6EA] p-6 sm:p-8"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" onClick={closeAuth} className="absolute top-4 right-4 p-2 rounded-full text-neutral-400 hover:bg-neutral-100" aria-label="Close authentication dialog"><X className="w-5 h-5" /></button>
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#E84A7F] to-[#C89D42] p-0.5 mx-auto"><div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-[#E84A7F]"><Lock className="w-6 h-6" /></div></div>
          <h2 id="auth-title" className="font-serif-display text-2xl font-bold text-[#2D1B22]">{title}</h2>
          <p className="text-xs text-[#7E6C74]">{subtitle}</p>
        </div>
        {authView === 'login' && <LoginForm />}
        {authView === 'register' && <RegisterForm />}
        {authView === 'forgot-password' && <ForgotPasswordForm />}
        {authView === 'reset-password' && <ResetPasswordForm />}
      </div>
    </div>
  );
};
