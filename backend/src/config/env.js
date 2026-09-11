import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { DEFAULT_ADMIN } from './adminDefaults.js';

const configDirectory = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({
  path: [
    path.resolve(configDirectory, '../../.env'),
    path.resolve(configDirectory, '../../../.env'),
  ],
});

const requiredInProduction = ['MONGODB_URI', 'JWT_SECRET'];

const parseInteger = (value, fallback) => {
  const parsed = Number.parseInt(value ?? '', 10);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = Object.freeze({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInteger(process.env.PORT, 4000),
  mongodbUri: process.env.MONGODB_URI ?? '',
  jwtSecret: process.env.JWT_SECRET ?? '',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '7d',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  appUrl: process.env.APP_URL ?? process.env.FRONTEND_URL ?? 'http://localhost:3000',
  admin: {
    fullName: process.env.SEED_ADMIN_NAME?.trim() || DEFAULT_ADMIN.fullName,
    email: process.env.SEED_ADMIN_EMAIL?.trim().toLowerCase() || DEFAULT_ADMIN.email,
    password: process.env.SEED_ADMIN_PASSWORD || DEFAULT_ADMIN.password,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME ?? '',
    apiKey: process.env.CLOUDINARY_API_KEY ?? '',
    apiSecret: process.env.CLOUDINARY_API_SECRET ?? '',
  },
  smtp: {
    host: process.env.SMTP_HOST ?? '',
    port: parseInteger(process.env.SMTP_PORT, 587),
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER ?? '',
    password: process.env.SMTP_PASSWORD ?? '',
    from: process.env.EMAIL_FROM ?? 'Al Jameelah <no-reply@example.com>',
  },
});

export const validateEnvironment = () => {
  const missing = requiredInProduction.filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (env.jwtSecret.length < 32) throw new Error('JWT_SECRET must contain at least 32 characters.');
};
