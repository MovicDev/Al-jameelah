import { Router } from 'express';
import { list } from '../controllers/userController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', authenticate, requireAdmin, asyncHandler(list));
export default router;

