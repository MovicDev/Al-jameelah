import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as controller from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { forgotPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from '../validators/authValidator.js';

const router = Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: 'draft-8', legacyHeaders: false });
router.post('/register', authLimiter, validate(registerSchema), asyncHandler(controller.register));
router.post('/login', authLimiter, validate(loginSchema), asyncHandler(controller.login));
router.get('/me', authenticate, asyncHandler(controller.me));
router.post('/logout', authenticate, asyncHandler(controller.logout));
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), asyncHandler(controller.forgotPassword));
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), asyncHandler(controller.resetPassword));
export default router;

