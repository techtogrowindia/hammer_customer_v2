import axios, { AxiosInstance } from 'axios';
import { setupInterceptors } from './api-interceptor';

const BASE_URL = 'https://hammerapp.in/api';

const createApiClient = (withBearerToken = false): AxiosInstance => {
  const client = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  setupInterceptors(client, { withBearerToken });

  return client;
};

export const apiClient = createApiClient();
export const authClient = createApiClient(true);

export default apiClient;
