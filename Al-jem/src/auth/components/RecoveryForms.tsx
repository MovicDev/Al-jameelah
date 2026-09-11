import React, { useState } from 'react';
import { Mail, Save } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { validateEmail, validatePassword } from '../utils/authValidation';
import { FormMessage } from './FormMessage';
import { PasswordInput } from './PasswordInput';

export const ForgotPasswordForm: React.FC = () => {
  const { forgotPassword, setAuthView } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = validateEmail(email);
    if (invalid) { setError(invalid); return; }
    setLoading(true); setError('');
    try { await forgotPassword(email); setMessage('If an account exists for that email, a reset link is on its way.'); }
    catch (caught) { setError(caught instanceof Error ? caught.message : 'Reset request failed.'); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <FormMessage message={error} /><FormMessage message={message} kind="success" />
      <div><label htmlFor="recovery-email" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Account email</label><input id="recovery-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" /></div>
      <button disabled={loading || Boolean(message)} className="w-full py-3.5 rounded-full bg-[#E84A7F] text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-60"><Mail className="w-4 h-4" />{loading ? 'Sending…' : 'Send reset link'}</button>
      <button type="button" onClick={() => setAuthView('login')} className="block mx-auto text-xs font-bold text-[#C89D42]">Back to sign in</button>
    </form>
  );
};

export const ResetPasswordForm: React.FC = () => {
  const { resetPassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = validatePassword(password) || (password !== confirm ? 'Passwords do not match.' : null);
    if (invalid) { setError(invalid); return; }
    setLoading(true); setError('');
    try { await resetPassword(password); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Password update failed.'); }
    finally { setLoading(false); }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <FormMessage message={error} />
      <PasswordInput label="New password" autoComplete="new-password" placeholder="Create a new password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      <PasswordInput label="Confirm new password" autoComplete="new-password" placeholder="Repeat your new password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
      <button disabled={loading} className="w-full py-3.5 rounded-full bg-[#E84A7F] text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-60"><Save className="w-4 h-4" />{loading ? 'Updating…' : 'Set new password'}</button>
    </form>
  );
};
