import { Router } from 'express';
import { upload } from '../controllers/mediaController.js';
import { authenticate, requireAdmin } from '../middleware/authMiddleware.js';
import { imageUpload } from '../middleware/uploadMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.use(authenticate, requireAdmin);
router.post('/product-image', imageUpload.single('image'), asyncHandler(upload('product')));
router.post('/service-image', imageUpload.single('image'), asyncHandler(upload('service')));
export default router;

