import { z } from 'zod';

const email = z.string().trim().toLowerCase().email().max(254);
const password = z.string().min(10, 'Password must contain at least 10 characters.').max(128)
  .regex(/[a-z]/, 'Password needs a lowercase letter.')
  .regex(/[A-Z]/, 'Password needs an uppercase letter.')
  .regex(/\d/, 'Password needs a number.')
  .regex(/[^A-Za-z0-9]/, 'Password needs a special character.');
const phone = z.string().trim()
  .regex(/^\+?[\d\s()-]+$/, 'Enter a valid phone number with at least 10 digits.')
  .refine((value) => {
    const digits = value.replace(/\D/g, '').length;
    return digits >= 10 && digits <= 15;
  }, 'Enter a valid phone number with at least 10 digits.');

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100),
    email,
    password,
    phone,
  }), params: z.any(), query: z.any(),
});

export const loginSchema = z.object({
  body: z.object({ email, password: z.string().min(1).max(128) }), params: z.any(), query: z.any(),
});

export const forgotPasswordSchema = z.object({
  body: z.object({ email }), params: z.any(), query: z.any(),
});

export const resetPasswordSchema = z.object({
  body: z.object({ token: z.string().min(32).max(256), password }), params: z.any(), query: z.any(),
});
