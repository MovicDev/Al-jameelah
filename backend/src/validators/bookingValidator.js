import { z } from 'zod';
import { objectId } from './commonValidators.js';

export const createBookingSchema = z.object({
  body: z.object({
    serviceId: objectId,
    date: z.string().date(),
    time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Time must use HH:mm format.'),
    notes: z.string().trim().max(1_000).optional(),
  }), params: z.any(), query: z.any(),
});

export const updateBookingSchema = z.object({
  body: z.object({ status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']) }),
  params: z.object({ id: objectId }), query: z.any(),
});

