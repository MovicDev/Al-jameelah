import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label: string;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ label, id, className = '', ...props }) => {
  const [visible, setVisible] = useState(false);
  const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-');

  return (
    <div>
      <label htmlFor={inputId} className="block text-xs font-semibold text-[#4A3E42] mb-1.5">{label}</label>
      <div className="relative">
        <input
          {...props}
          id={inputId}
          type={visible ? 'text' : 'password'}
          className={`w-full pl-4 pr-11 py-3 rounded-xl bg-[#FAF7F5] border border-[#EFE5EB] text-sm text-[#2D1B22] placeholder:text-[#A8969F] focus:outline-none focus:ring-2 focus:ring-[#E84A7F]/30 focus:border-[#E84A7F] ${className}`}
        />
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8C7A82] hover:text-[#2D1B22]"
          aria-label={visible ? 'Hide password' : 'Show password'}
        >
          {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
