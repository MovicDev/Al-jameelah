import { apiRequest } from './apiClient';

const uploadCatalogImage = async (image: File, kind: 'product' | 'service'): Promise<string> => {
  const body = new FormData();
  body.append('image', image);
  const result = await apiRequest<{ image: { secureUrl: string; publicId: string } }>(`/media/${kind}-image`, { method: 'POST', body }, true);
  return result.image.secureUrl;
};

export const uploadProductImage = (image: File) => uploadCatalogImage(image, 'product');
export const uploadServiceImage = (image: File) => uploadCatalogImage(image, 'service');
