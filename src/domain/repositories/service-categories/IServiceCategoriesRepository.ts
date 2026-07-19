import type { GetCategoriesResponse } from '@/domain/models/service-categories/getCategoriesResponse';

export interface IServiceCategoriesRepository {
  getCategories: () => Promise<GetCategoriesResponse>;
}
