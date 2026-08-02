import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './api-interceptor';

// admin.hammerapp.in serves both the admin dashboard and the mobile API.
const BASE_URL = 'https://admin.hammerapp.in/api';

const createApiClient = (isAuth = false): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  setupInterceptors(client, { isAuth });

  return client;
};

export const apiClient = createApiClient();
export const authClient = createApiClient(true);

export default apiClient;
