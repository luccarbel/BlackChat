const cleanBaseUrl = (value = '') => value.replace(/\/$/, '');

export const API_BASE_URL = cleanBaseUrl(process.env.REACT_APP_API_URL || '');
export const SOCKET_URL = cleanBaseUrl(process.env.REACT_APP_SERVER_URL || API_BASE_URL || '');

export const resolveApiUrl = (path = '') => {
  if (!path) return API_BASE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE_URL) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
};

export const resolveMediaUrl = (path = '') => resolveApiUrl(path);