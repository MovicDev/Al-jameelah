import { Router } from 'express';
import * as controller from '../controllers/serviceController.js';
import { authenticate, optionalAuthenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { idParams } from '../validators/commonValidators.js';
import { createServiceSchema, updateServiceSchema } from '../validators/serviceValidator.js';

const router = Router();
router.get('/', optionalAuthenticate, asyncHandler(controller.list));
router.get('/:id', validate(idParams), asyncHandler(controller.get));
router.post('/', authenticate, requireAdmin, validate(createServiceSchema), asyncHandler(controller.create));
router.patch('/:id', authenticate, requireAdmin, validate(updateServiceSchema), asyncHandler(controller.update));
router.delete('/:id', authenticate, requireAdmin, validate(idParams), asyncHandler(controller.remove));
export default router;

