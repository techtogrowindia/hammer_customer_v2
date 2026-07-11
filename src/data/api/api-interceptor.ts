import { AxiosError, AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

const getAccessToken = async (): Promise<string | null> => {
  // return await SecureStore.getItemAsync('accessToken');
  return '12345678';
};

type InterceptorOptions = {
  withBearerToken?: boolean;
};

export const setupInterceptors = (api: AxiosInstance, options: InterceptorOptions = {}) => {
  const { withBearerToken = false } = options;

  api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
      if (withBearerToken) {
        const token = await getAccessToken();

        if (token) {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
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
