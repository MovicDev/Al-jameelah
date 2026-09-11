import { z } from 'zod';

export const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'Invalid resource identifier.');
export const idParams = z.object({ body: z.any(), query: z.any(), params: z.object({ id: objectId }) });
export const nonEmptyText = (max = 500) => z.string().trim().min(1).max(max);

