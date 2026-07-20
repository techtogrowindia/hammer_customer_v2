import { ServiceCategoriesRepository } from '@/data/repositories/service-categories/service-categories-repository';
import { useBoundStore } from '@/store/boundStore';
import { useShallow } from 'zustand/shallow';

export const useSCApisHelper = () => {
  const { toggleSCModuleLoader, setCategoryList } = useBoundStore(
    useShallow((state) => ({
      toggleSCModuleLoader: state.toggleSCModuleLoader,
      setCategoryList: state.setCategoryList,
    })),
  );

  const getServiceCategories = async () => {
    toggleSCModuleLoader(true);
    try {
      const response = await ServiceCategoriesRepository.getCategories();

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.data && response?.data?.categories && response?.data?.categories?.length > 0) {
        setCategoryList(response?.data?.categories?.length > 0 ? response?.data?.categories : []);
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Unable to fetch service categories. Please try again later.';

      //   toastiva.error(message, {
      //     fill: AppColors.white,
      //     styles: {
      //       title: { color: AppColors.error },
      //     },
      //     showProgress: false,
      //   });
      console.error('Error fetching service categories:', error);
      throw error;
    } finally {
      toggleSCModuleLoader(false);
    }
  };

  return {
    getServiceCategories,
  };
};
