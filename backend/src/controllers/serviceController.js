import * as serviceService from '../services/serviceService.js';
import { serializeService } from '../serializers/index.js';
import { sendSuccess } from '../utils/respond.js';

export const list = async (request, response) => sendSuccess(response, 200, 'Services loaded.', { data: (await serviceService.listServices(request.user?.role === 'admin')).map(serializeService) });
export const get = async (request, response) => sendSuccess(response, 200, 'Service loaded.', { data: serializeService(await serviceService.getService(request.params.id)) });
export const create = async (request, response) => sendSuccess(response, 201, 'Service created successfully.', { data: serializeService(await serviceService.createService(request.validated.body)) });
export const update = async (request, response) => sendSuccess(response, 200, 'Service updated successfully.', { data: serializeService(await serviceService.updateService(request.params.id, request.validated.body)) });
export const remove = async (request, response) => { await serviceService.deleteService(request.params.id); sendSuccess(response, 200, 'Service deleted successfully.'); };

