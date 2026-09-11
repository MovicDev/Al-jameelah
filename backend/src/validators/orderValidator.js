import { z } from 'zod';
import { objectId } from './commonValidators.js';

export const createOrderSchema = z.object({
  body: z.object({
    customerInfo: z.object({
      customerName: z.string().trim().min(2).max(100),
      customerPhone: z.string().trim().min(7).max(30),
      deliveryCityState: z.string().trim().min(2).max(150),
      deliveryAddress: z.string().trim().max(300).optional().default(''),
      notes: z.string().trim().max(1_000).optional().default(''),
    }),
    items: z.array(z.object({
      productId: objectId,
      size: z.string().trim().min(1).max(80),
      quantity: z.number().int().min(1).max(100),
    })).min(1).max(50),
  }), params: z.any(), query: z.any(),
});

export const updateOrderSchema = z.object({
  body: z.object({ status: z.enum(['pending', 'whatsapp_sent', 'contacted', 'confirmed', 'processing', 'completed', 'delivered', 'cancelled']) }),
  params: z.object({ id: objectId }), query: z.any(),
});

