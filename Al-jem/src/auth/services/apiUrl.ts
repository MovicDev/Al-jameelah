const LOCAL_API_URL = 'http://localhost:4000/api';
const DEPLOYED_API_URL = 'https://al-jameelah.onrender.com/api';

export const resolveApiUrl = (configuredUrl: string | undefined, isDevelopment: boolean): string => {
  const override = configuredUrl?.trim();
  const apiUrl = override || (isDevelopment ? LOCAL_API_URL : DEPLOYED_API_URL);

  return apiUrl.replace(/\/+$/, '');
};

