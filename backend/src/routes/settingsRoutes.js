import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/settingsController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const fields = {
  brandName: z.string().trim().min(1).max(150), tagline: z.string().trim().max(300),
  whatsappNumber: z.string().trim().min(7).max(30), phoneDisplay: z.string().trim().max(50),
  instagram: z.string().trim().max(200), tiktok: z.string().trim().max(200), facebook: z.string().trim().max(200),
  email: z.string().trim().email().max(254), address: z.string().trim().max(300), city: z.string().trim().max(100), state: z.string().trim().max(100),
  shippingNotice: z.string().trim().max(500), announcementBar: z.string().trim().max(500),
  currencySymbol: z.string().trim().min(1).max(5), currencyCode: z.string().trim().length(3),
};
const updateSchema = z.object({ body: z.object(fields).partial().refine((value) => Object.keys(value).length > 0), params: z.any(), query: z.any() });
const router = Router();
router.get('/', asyncHandler(controller.get));
router.patch('/', authenticate, requireAdmin, validate(updateSchema), asyncHandler(controller.update));
export default router;

