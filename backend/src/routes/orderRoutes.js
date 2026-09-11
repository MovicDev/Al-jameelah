import { Router } from 'express';
import * as controller from '../controllers/orderController.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createOrderSchema, updateOrderSchema } from '../validators/orderValidator.js';

const router = Router();
router.post('/', optionalAuthenticate, validate(createOrderSchema), asyncHandler(controller.create));
router.get('/mine', authenticate, asyncHandler(controller.mine));
router.get('/', authenticate, requireAdmin, asyncHandler(controller.list));
router.patch('/:id', authenticate, requireAdmin, validate(updateOrderSchema), asyncHandler(controller.updateStatus));
export default router;

