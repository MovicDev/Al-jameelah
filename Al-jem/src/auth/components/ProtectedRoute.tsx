import React, { useEffect, useState } from 'react';
import { LoaderCircle, LockKeyhole } from 'lucide-react';
import { useAuth } from '../AuthContext';
import type { UserRole } from '../types';
import { verifyAdminAccess } from '../services/profileService';

export const ProtectedRoute: React.FC<{ children: React.ReactNode; requiredRole?: UserRole }> = ({ children, requiredRole }) => {
  const { isAuthenticated, isAdmin, isLoading, openAuth } = useAuth();
  const [serverAuthorized, setServerAuthorized] = useState(requiredRole !== 'admin');
  const [isCheckingRole, setIsCheckingRole] = useState(requiredRole === 'admin');
  useEffect(() => {
    let active = true;
    if (requiredRole !== 'admin' || !isAuthenticated || !isAdmin) {
      setServerAuthorized(requiredRole !== 'admin');
      setIsCheckingRole(false);
      return () => { active = false; };
    }
    setIsCheckingRole(true);
    void verifyAdminAccess()
      .then((authorized) => { if (active) setServerAuthorized(authorized); })
      .catch(() => { if (active) setServerAuthorized(false); })
      .finally(() => { if (active) setIsCheckingRole(false); });
    return () => { active = false; };
  }, [isAdmin, isAuthenticated, requiredRole]);

  if (isLoading || isCheckingRole) return <div className="min-h-[50vh] flex items-center justify-center"><LoaderCircle className="w-7 h-7 animate-spin text-[#E84A7F]" /></div>;
  if (!isAuthenticated) return <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4"><LockKeyhole className="w-10 h-10 text-[#C89D42] mb-3" /><h2 className="font-serif-display text-2xl font-bold">Sign in required</h2><button onClick={() => openAuth('login')} className="mt-4 px-5 py-2.5 rounded-full bg-[#E84A7F] text-white text-sm font-bold">Sign in</button></div>;
  if (requiredRole === 'admin' && (!isAdmin || !serverAuthorized)) return <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4"><LockKeyhole className="w-10 h-10 text-[#C89D42] mb-3" /><h2 className="font-serif-display text-2xl font-bold">Admin access required</h2><p className="text-sm text-[#7E6C74] mt-2">Your account does not have permission to manage the store.</p></div>;
  return <>{children}</>;
};
