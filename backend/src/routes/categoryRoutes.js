import { Router } from 'express';
import * as controller from '../controllers/categoryController.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/commonValidators.js';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidator.js';

const router = Router();
router.get('/', optionalAuthenticate, asyncHandler(controller.list));
router.post('/', authenticate, requireAdmin, validate(createCategorySchema), asyncHandler(controller.create));
router.patch('/:id', authenticate, requireAdmin, validate(updateCategorySchema), asyncHandler(controller.update));
router.delete('/:id', authenticate, requireAdmin, validate(idParams), asyncHandler(controller.remove));
export default router;

