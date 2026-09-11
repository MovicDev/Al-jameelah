import { Router } from 'express';
import { z } from 'zod';
import * as controller from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { imageUpload } from '../middleware/uploadMiddleware.js';
import { validate } from '../middleware/validationMiddleware.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const updateSchema = z.object({
  body: z.object({
    fullName: z.string().trim().min(2).max(100).optional(),
    phone: z.string().trim().max(30).optional(),
  }).refine((value) => Object.keys(value).length > 0, 'At least one field is required.'),
  params: z.any(), query: z.any(),
});
const strongPassword = z.string().min(10).max(128)
  .regex(/[a-z]/, 'Password needs a lowercase letter.')
  .regex(/[A-Z]/, 'Password needs an uppercase letter.')
  .regex(/\d/, 'Password needs a number.')
  .regex(/[^A-Za-z0-9]/, 'Password needs a special character.');
const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1).max(128),
    newPassword: strongPassword,
  }),
  params: z.any(), query: z.any(),
});
const router = Router();
router.use(authenticate);
router.get('/', asyncHandler(controller.getProfile));
router.patch('/', validate(updateSchema), asyncHandler(controller.updateProfile));
router.patch('/password', validate(changePasswordSchema), asyncHandler(controller.changePassword));
router.post('/avatar', imageUpload.single('avatar'), asyncHandler(controller.uploadAvatar));
export default router;
