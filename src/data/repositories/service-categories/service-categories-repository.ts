import type { GetCategoriesResponse } from '@/domain/models/service-categories/getCategoriesResponse';
import type { IServiceCategoriesRepository } from '@/domain/repositories/service-categories/IServiceCategoriesRepository';

import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';

const getSCParams = (params?: Record<string, string | boolean | number>) => {
  const pincode = '625107';
  return {
    params: {
      ...(pincode ? { pincode } : {}),
      ...(params ?? {}),
    },
  };
};

export const ServiceCategoriesRepository: IServiceCategoriesRepository = {
  getCategories: async (): Promise<GetCategoriesResponse> => {
    const response = await apiClient.get(apiEndpoints.services, { ...getSCParams() });

    return response.data;
  },
};
