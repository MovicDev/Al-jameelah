import React, { useEffect, useRef, useState } from 'react';
import { Camera, KeyRound, LoaderCircle, Save, UserRound } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { validateAvatar, validateFullName, validatePassword } from '../utils/authValidation';
import { FormMessage } from './FormMessage';
import { PasswordInput } from './PasswordInput';

export const ProfileView: React.FC = () => {
  const { user, profile, saveProfile, saveAvatar, changePassword } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => setFullName(profile?.full_name ?? ''), [profile?.full_name]);

  const saveName = async (event: React.FormEvent) => {
    event.preventDefault(); const invalid = validateFullName(fullName);
    if (invalid) { setError(invalid); return; }
    setLoading(true); setError(''); setMessage('');
    try { await saveProfile(fullName); setMessage('Profile saved.'); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Profile update failed.'); }
    finally { setLoading(false); }
  };
  const chooseAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; if (!file) return;
    const invalid = validateAvatar(file); if (invalid) { setError(invalid); return; }
    setLoading(true); setError(''); setMessage('');
    try { await saveAvatar(file); setMessage('Profile image updated.'); } catch (caught) { setError(caught instanceof Error ? caught.message : 'Avatar upload failed.'); }
    finally { setLoading(false); event.target.value = ''; }
  };
  const savePassword = async (event: React.FormEvent) => {
    event.preventDefault();
    const invalid = validatePassword(newPassword)
      || (newPassword !== confirmPassword ? 'The new passwords do not match.' : null)
      || (currentPassword === newPassword ? 'Choose a password that is different from your current password.' : null);
    if (!currentPassword) { setPasswordError('Enter your current password.'); return; }
    if (invalid) { setPasswordError(invalid); return; }
    setPasswordLoading(true); setPasswordError(''); setPasswordMessage('');
    try {
      await changePassword(currentPassword, newPassword);
      setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      setPasswordMessage('Password changed successfully.');
    } catch (caught) {
      setPasswordError(caught instanceof Error ? caught.message : 'Password change failed.');
    } finally { setPasswordLoading(false); }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <div className="bg-white border border-[#F0E6EA] rounded-3xl shadow-sm p-6 sm:p-10">
        <div className="flex flex-col sm:flex-row items-center gap-5 pb-7 border-b border-[#F5ECF0]">
          <div className="relative">
            {profile?.avatar_url ? <img src={profile.avatar_url} alt="Profile avatar" className="w-24 h-24 rounded-full object-cover border-4 border-[#FDF2F7]" /> : <div className="w-24 h-24 rounded-full bg-[#FDF2F7] flex items-center justify-center"><UserRound className="w-10 h-10 text-[#E84A7F]" /></div>}
            <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="absolute -bottom-1 -right-1 p-2.5 rounded-full bg-[#2D1B22] text-white shadow-md disabled:opacity-60" aria-label="Upload a new avatar"><Camera className="w-4 h-4" /></button>
            <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={chooseAvatar} className="hidden" />
          </div>
          <div className="text-center sm:text-left"><h2 className="font-serif-display text-3xl font-bold text-[#2D1B22]">My profile</h2><p className="text-sm text-[#7E6C74] mt-1">{user?.email}</p><p className="text-[11px] text-[#9C8B93] mt-1">JPG, PNG, or WebP · maximum 5 MB</p></div>
        </div>
        <form onSubmit={saveName} className="pt-7 space-y-5">
          <FormMessage message={error} /><FormMessage message={message} kind="success" />
          <div><label htmlFor="profile-name" className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Full name</label><input id="profile-name" value={fullName} onChange={(event) => setFullName(event.target.value)} maxLength={100} required className="w-full px-4 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30" /></div>
          <div><label className="block text-xs font-semibold text-[#4A3E42] mb-1.5">Email</label><input value={user?.email ?? ''} disabled className="w-full px-4 py-3 rounded-xl bg-neutral-100 border border-neutral-200 text-sm text-neutral-500" /><p className="text-[10px] text-[#8C7A82] mt-1">Email changes are managed securely by the account API.</p></div>
          <button type="submit" disabled={loading} className="px-6 py-3 rounded-full bg-[#E84A7F] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-60">{loading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}Save profile</button>
        </form>
        <form onSubmit={savePassword} className="mt-8 pt-7 border-t border-[#F5ECF0] space-y-5">
          <div><h3 className="font-serif-display text-2xl font-bold text-[#2D1B22]">Change password</h3><p className="text-xs text-[#7E6C74] mt-1">Replace the default password after your first admin sign-in.</p></div>
          <FormMessage message={passwordError} /><FormMessage message={passwordMessage} kind="success" />
          <PasswordInput label="Current password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} required />
          <PasswordInput label="New password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} required />
          <PasswordInput label="Confirm new password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
          <button type="submit" disabled={passwordLoading} className="px-6 py-3 rounded-full bg-[#2D1B22] text-white font-bold text-sm flex items-center gap-2 disabled:opacity-60">{passwordLoading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}Change password</button>
        </form>
      </div>
    </section>
  );
};
