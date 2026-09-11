import React from 'react';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const FormMessage: React.FC<{ message?: string | null; kind?: 'error' | 'success' }> = ({ message, kind = 'error' }) => {
  if (!message) return null;
  const isError = kind === 'error';
  return (
    <div role={isError ? 'alert' : 'status'} className={`p-3 rounded-2xl border flex gap-2 text-xs font-medium ${isError ? 'bg-rose-50 border-rose-200 text-rose-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'}`}>
      {isError ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle2 className="w-4 h-4 shrink-0" />}
      <span>{message}</span>
    </div>
  );
};
