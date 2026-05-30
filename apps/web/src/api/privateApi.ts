import axios from 'axios';
import { storage } from '../lib/storage';

const privateApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

privateApi.interceptors.request.use((config) => {
  const token = storage.getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

privateApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = storage.getRefreshToken();

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
          {
            refreshToken,
          },
        );

        const newAccessToken = response.data.accessToken;

        storage.setAccessToken(newAccessToken);

        originalRequest.headers.Authorization =
          `Bearer ${newAccessToken}`;

        return privateApi(originalRequest);
      } catch (refreshError) {
        storage.clear();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  },
);

export default privateApi;