import { Router } from 'express';
import * as controller from '../controllers/productController.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/commonValidators.js';
import { createProductSchema, updateProductSchema } from '../validators/productValidator.js';

const router = Router();
router.get('/', optionalAuthenticate, asyncHandler(controller.list));
router.get('/:id', validate(idParams), asyncHandler(controller.get));
router.post('/', authenticate, requireAdmin, validate(createProductSchema), asyncHandler(controller.create));
router.patch('/:id', authenticate, requireAdmin, validate(updateProductSchema), asyncHandler(controller.update));
router.delete('/:id', authenticate, requireAdmin, validate(idParams), asyncHandler(controller.remove));
export default router;

