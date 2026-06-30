import { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const getAccessToken = async (): Promise<string | null> => {
  // TODO
  // return await SecureStore.getItemAsync('accessToken');

  return null;
};

export const setupInterceptors = (api: AxiosInstance) => {
  api.interceptors.request.use(
    async (config: AxiosRequestConfig): Promise<any> => {
      const token = await getAccessToken();

      if (token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${token}`,
        };
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
