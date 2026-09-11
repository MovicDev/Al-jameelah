import { Router } from 'express';
import adminRoutes from './adminRoutes.js';
import authRoutes from './authRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import mediaRoutes from './mediaRoutes.js';
import orderRoutes from './orderRoutes.js';
import productRoutes from './productRoutes.js';
import profileRoutes from './profileRoutes.js';
import serviceRoutes from './serviceRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import userRoutes from './userRoutes.js';

const router = Router();
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/services', serviceRoutes);
router.use('/categories', categoryRoutes);
router.use('/bookings', bookingRoutes);
router.use('/orders', orderRoutes);
router.use('/profile', profileRoutes);
router.use('/media', mediaRoutes);
router.use('/settings', settingsRoutes);
router.use('/admin', adminRoutes);
router.use('/users', userRoutes);
export default router;

