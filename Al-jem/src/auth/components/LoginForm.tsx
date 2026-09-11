import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { validateEmail } from '../utils/authValidation';
import { FormMessage } from './FormMessage';
import { PasswordInput } from './PasswordInput';

export const LoginForm: React.FC = () => {
  const { login, setAuthView, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateEmail(email) || (!password ? 'Password is required.' : null);
    if (validationError) { setError(validationError); return; }
    setError('');
    setIsSubmitting(true);
    try { await login(email, password); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Sign in failed.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <FormMessage message={error || authError} />
      <div>
        <label htmlFor="login-email" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Email</label>
        <input id="login-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" />
      </div>
      <PasswordInput label="Password" autoComplete="current-password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <div className="flex justify-end">
        <button type="button" onClick={() => setAuthView('forgot-password')} className="text-xs font-semibold text-[#E84A7F] hover:text-[#D42A63]">Forgot password?</button>
      </div>
      <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-full bg-[#E84A7F] hover:bg-[#D42A63] text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-60">
        <KeyRound className="w-4 h-4" /> {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-xs text-[#7E6C74]">New here? <button type="button" onClick={() => setAuthView('register')} className="font-bold text-[#C89D42]">Create an account</button></p>
    </form>
  );
};
