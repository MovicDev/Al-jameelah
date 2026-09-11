export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateEmail = (email: string): string | null => {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_PATTERN.test(email.trim())) return 'Enter a valid email address.';
  return null;
};

export const validateFullName = (fullName: string): string | null => {
  const length = fullName.trim().length;
  if (length < 2) return 'Full name must be at least 2 characters.';
  if (length > 100) return 'Full name is too long.';
  return null;
};

export const validatePhone = (phone: string): string | null => {
  const digits = phone.replace(/\D/g, '');
  if (!/^[+\d\s()-]+$/.test(phone.trim()) || digits.length < 10 || digits.length > 15) {
    return 'Enter a valid phone number with at least 10 digits.';
  }
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (password.length < 10) return `Password must contain at least 10 characters (currently ${password.length}).`;
  if (!/[a-z]/.test(password)) return 'Add at least one lowercase letter.';
  if (!/[A-Z]/.test(password)) return 'Add at least one uppercase letter.';
  if (!/\d/.test(password)) return 'Add at least one number.';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Add at least one special character.';
  return null;
};

export const validateAvatar = (file: File): string | null => {
  const allowed = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowed.includes(file.type)) return 'Use a JPG, PNG, or WebP image.';
  if (file.size > 5 * 1024 * 1024) return 'Avatar images must be 5 MB or smaller.';
  return null;
};
