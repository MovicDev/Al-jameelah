import { Router } from 'express';
import * as controller from '../controllers/bookingController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createBookingSchema, updateBookingSchema } from '../validators/bookingValidator.js';

const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(controller.list));
router.post('/', validate(createBookingSchema), asyncHandler(controller.create));
router.patch('/:id', requireAdmin, validate(updateBookingSchema), asyncHandler(controller.updateStatus));
export default router;

