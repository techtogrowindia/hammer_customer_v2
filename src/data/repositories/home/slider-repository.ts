import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { GetSliderImagesResponse, SliderImage } from '@/domain/models/home/slider-image';

export const SliderRepository = {
  /**
   * Home-screen banners, set in the admin panel.
   *
   * An empty list is a real answer, not a failure: it means nobody has put a
   * banner up, and the carousel hides itself rather than inventing an offer.
   */
  getSliderImages: async (): Promise<SliderImage[]> => {
    const response = await apiClient.get<GetSliderImagesResponse>(apiEndpoints.sliderImages);
    return response.data?.success ? (response.data.data ?? []) : [];
  },
};
