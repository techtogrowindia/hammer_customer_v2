import { useBoundStore } from '@/store/boundStore';
import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const getAccessToken = async ({ isAuth = false }: { isAuth?: boolean } = {}): Promise<string | null> => {
  if (!isAuth) {
    console.log('getAccessToken', useBoundStore.getState().userToken);
    return useBoundStore.getState().userToken;
  }
  return '12345678';
};

type InterceptorOptions = {
  isAuth?: boolean;
};

export const setupInterceptors = (api: AxiosInstance, options: InterceptorOptions = {}) => {
  const { isAuth = false } = options;

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      const token = await getAccessToken({ isAuth });

      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }

      console.log('➡️', config.method?.toUpperCase(), config.url);

      return config;
    },

    (error: AxiosError) => {
      console.log('❌ Request Error', error);
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => {
      console.log('✅', response.status, response.config.url);
      return response;
    },

    async (error: AxiosError) => {
      const status = error.response?.status;

      switch (status) {
        case 400:
          console.log('Bad Request');
          break;
        case 401:
          console.log('Unauthorized');
          // logout user
          break;
        case 403:
          console.log('Forbidden');
          break;
        case 404:
          console.log('Not Found');
          break;
        case 500:
          console.log('Server Error');
          break;
        default:
          console.log(error.message);
      }

      return Promise.reject(error);
    },
  );
};
