import { AppColors } from '@/core/theme/app-colors';
import { OrdersRepository } from '@/data/repositories/orders/orders-repository';
import { PlaceOrderRequest } from '@/data/requests/orders/orders-request-builder';
import { useBoundStore } from '@/store/boundStore';
import { toastiva } from 'toastiva';
import { useShallow } from 'zustand/shallow';

export const useOrderApisHelper = () => {
  const { toggleAppLoader } = useBoundStore(
    useShallow((state) => ({
      toggleAppLoader: state.toggleAppLoader,
    })),
  );

  const placeOrder = async (request: PlaceOrderRequest) => {
    toggleAppLoader(true);
    try {
      const response = await OrdersRepository.placeOrder(request);

      if (!response?.success) {
        throw new Error(response?.message);
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to place order. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });
      console.error('Error placing order:', error);
      throw error;
    } finally {
      toggleAppLoader(false);
    }
  };

  return {
    placeOrder,
  };
};
