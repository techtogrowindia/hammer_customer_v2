import { AppColors } from '@/core/theme/app-colors';
import { OrdersRepository } from '@/data/repositories/orders/orders-repository';
import { PlaceOrderRequest } from '@/data/requests/orders/orders-request-builder';
import { useBoundStore } from '@/store/boundStore';
import { toastiva } from 'toastiva';
import { useShallow } from 'zustand/shallow';

export const useOrderApisHelper = () => {
  const { toggleAppLoader, toggleOrderModuleLoader, setOrdersList } = useBoundStore(
    useShallow((state) => ({
      toggleAppLoader: state.toggleAppLoader,
      toggleOrderModuleLoader: state.toggleOrderModuleLoader,
      setOrdersList: state.setOrdersList,
    })),
  );

  const placeOrder = async (request: PlaceOrderRequest) => {
    toggleAppLoader(true);
    try {
      const response = await OrdersRepository.placeOrder(request);

      if (!response?.success) {
        throw new Error(response?.message);
      }

      await listOrders();

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
  const listOrders = async () => {
    toggleOrderModuleLoader(true);
    try {
      const response = await OrdersRepository.listOrders();

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.data && response?.data?.orders && response?.data?.orders?.length > 0) {
        setOrdersList(response?.data?.orders);
      } else {
        setOrdersList([]);
      }

      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to fetch orders. Please try again later.';

      // toastiva.error(message, {
      //   fill: AppColors.white,
      //   styles: {
      //     title: { color: AppColors.error },
      //   },
      //   showProgress: false,
      // });
      console.error('Error fetching orders:', error);
      throw error;
    } finally {
      toggleOrderModuleLoader(false);
    }
  };
  return {
    placeOrder,
    listOrders,
  };
};
