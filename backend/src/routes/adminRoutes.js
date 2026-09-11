import { Router } from 'express';
import * as controller from '../controllers/adminController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.get('/access', asyncHandler(controller.access));
router.get('/stats', asyncHandler(controller.stats));
export default router;

