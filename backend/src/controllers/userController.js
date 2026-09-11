import { serializeProfile } from '../serializers/index.js';
import { listUsers } from '../services/userService.js';
import { sendSuccess } from '../utils/respond.js';

export const list = async (_request, response) => {
  const users = await listUsers();
  sendSuccess(response, 200, 'Users loaded.', { data: users.map(serializeProfile) });
};
