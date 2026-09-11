import { getStats } from '../services/adminService.js';
import { sendSuccess } from '../utils/respond.js';

export const access = async (_request, response) => sendSuccess(response, 200, 'Administrator access confirmed.', { authorized: true });
export const stats = async (_request, response) => {
  sendSuccess(response, 200, 'Dashboard statistics loaded.', { data: await getStats() });
};
