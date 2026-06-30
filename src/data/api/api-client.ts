import axios from 'axios';
import { setupInterceptors } from './api-interceptor';

export const apiClient = axios.create({
  baseURL: 'https://hammerapp.in/api',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
