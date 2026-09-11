import * as settingsService from '../services/settingsService.js';
import { sendSuccess } from '../utils/respond.js';

export const get = async (_request, response) => sendSuccess(response, 200, 'Store settings loaded.', { data: await settingsService.getSettings() });
export const update = async (request, response) => sendSuccess(response, 200, 'Store settings updated.', { data: await settingsService.updateSettings(request.validated.body) });

