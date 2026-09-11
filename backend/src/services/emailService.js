import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

export const sendPasswordReset = async (email, resetUrl) => {
  if (!env.smtp.host) {
    if (env.nodeEnv !== 'production') console.info(`Password reset for ${email}: ${resetUrl}`);
    return;
  }
  const transport = nodemailer.createTransport({
    host: env.smtp.host,
    port: env.smtp.port,
    secure: env.smtp.secure,
    auth: env.smtp.user ? { user: env.smtp.user, pass: env.smtp.password } : undefined,
  });
  await transport.sendMail({
    from: env.smtp.from,
    to: email,
    subject: 'Reset your Al Jameelah password',
    text: `Use this secure link to reset your password. It expires in one hour: ${resetUrl}`,
  });
};

