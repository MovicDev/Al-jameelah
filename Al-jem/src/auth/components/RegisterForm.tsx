import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { validateEmail, validateFullName, validatePassword, validatePhone } from '../utils/authValidation';
import { FormMessage } from './FormMessage';
import { PasswordInput } from './PasswordInput';

export const RegisterForm: React.FC = () => {
  const { register, setAuthView } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    const validationError = validateFullName(fullName) || validateEmail(email) || validatePhone(phone) || validatePassword(password)
      || (password !== confirmPassword ? 'Passwords do not match.' : null);
    if (validationError) { setError(validationError); return; }
    setError('');
    setIsSubmitting(true);
    try {
      await register({ fullName, email, phone, password });
    } catch (caught) { setError(caught instanceof Error ? caught.message : 'Registration failed.'); }
    finally { setIsSubmitting(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3.5">
      <FormMessage message={error} />
      <div>
        <label htmlFor="register-name" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Full name</label>
        <input id="register-name" autoComplete="name" placeholder="Your full name" value={fullName} onChange={(event) => setFullName(event.target.value)} required maxLength={100} className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" />
      </div>
      <div>
        <label htmlFor="register-email" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Email</label>
        <input id="register-email" type="email" autoComplete="email" placeholder="you@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" />
      </div>
      <div>
        <label htmlFor="register-phone" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Phone number</label>
        <input id="register-phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="e.g. +234 803 123 4567" value={phone} onChange={(event) => setPhone(event.target.value)} required className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" />
      </div>
      <PasswordInput label="Password" autoComplete="new-password" placeholder="Create a strong password" value={password} onChange={(event) => setPassword(event.target.value)} required aria-describedby="password-policy" />
      <p id="password-policy" className="text-[10px] text-[#8C7A82]">10+ characters with uppercase, lowercase, number, and symbol.</p>
      <PasswordInput label="Confirm password" autoComplete="new-password" placeholder="Repeat your password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
      <p className="text-[10px] text-[#8C7A82]">After registration, you can securely upload a profile image from My Profile.</p>
      <button type="submit" disabled={isSubmitting} className="w-full py-3.5 rounded-full bg-[#E84A7F] hover:bg-[#D42A63] text-white font-bold text-sm flex justify-center items-center gap-2 disabled:opacity-60">
        <UserPlus className="w-4 h-4" /> {isSubmitting ? 'Creating account…' : 'Create account'}
      </button>
      <p className="text-center text-xs text-[#7E6C74]">Already registered? <button type="button" onClick={() => setAuthView('login')} className="font-bold text-[#C89D42]">Sign in</button></p>
    </form>
  );
};
