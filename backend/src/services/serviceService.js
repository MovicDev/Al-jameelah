import { Service } from '../models/Service.js';
import { AppError } from '../utils/AppError.js';
import { toSlug } from '../utils/slug.js';
import { deleteImage } from './cloudinaryService.js';
import { resolveImage } from './mediaService.js';

export const listServices = (includeUnavailable = false) => Service.find(includeUnavailable ? {} : { available: true }).sort({ popular: -1, createdAt: -1 });

export const getService = async (id) => {
  const service = await Service.findById(id);
  if (!service) throw new AppError(404, 'service_not_found', 'Service not found.');
  return service;
};

export const createService = async (input) => Service.create({
  ...input,
  slug: toSlug(input.slug || input.name),
  image: await resolveImage(input.image),
});

export const updateService = async (id, input) => {
  const service = await getService(id);
  const previousPublicId = service.image?.publicId;
  Object.assign(service, input, input.name || input.slug ? { slug: toSlug(input.slug || input.name || service.name) } : {});
  if ('image' in input) service.image = await resolveImage(input.image);
  await service.save();
  if ('image' in input && previousPublicId !== service.image?.publicId) await deleteImage(previousPublicId);
  return service;
};

export const deleteService = async (id) => {
  const service = await getService(id);
  await service.deleteOne();
  await deleteImage(service.image?.publicId);
};

