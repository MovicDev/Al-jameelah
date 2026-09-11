import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const durationToSeconds = (duration) => {
  if (/^\d+$/.test(duration)) return Number(duration);
  const match = /^(\d+)([smhd])$/.exec(duration);
  if (!match) return 7 * 24 * 60 * 60;
  const multiplier = { s: 1, m: 60, h: 3600, d: 86400 }[match[2]];
  return Number(match[1]) * multiplier;
};

export const issueSession = (user) => {
  const expiresInSeconds = durationToSeconds(env.jwtExpiresIn);
  const accessToken = jwt.sign({ role: user.role }, env.jwtSecret, {
    subject: user.id,
    expiresIn: expiresInSeconds,
    issuer: 'al-jameelah-api',
    audience: 'al-jameelah-web',
  });
  return {
    access_token: accessToken,
    expires_at: Math.floor(Date.now() / 1000) + expiresInSeconds,
    user: { id: user.id, email: user.email },
  };
};

export const verifyToken = (token) => jwt.verify(token, env.jwtSecret, {
  issuer: 'al-jameelah-api',
  audience: 'al-jameelah-web',
});

