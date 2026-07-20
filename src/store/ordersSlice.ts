import { GPDData } from '@/domain/models/orders/place-order-response';
import { StateCreator } from 'zustand';

export type ordersSliceType = {
  showOrderModuleLoader: boolean;
  toggleOrderModuleLoader: (toggle: boolean) => void;
  orderList: GPDData[];
  setOrdersList: (orders: GPDData[]) => void;
};
export const createOrdersSlice: StateCreator<ordersSliceType> = (set, get) => ({
  showOrderModuleLoader: false,
  toggleOrderModuleLoader: (toggle) => set({ showOrderModuleLoader: toggle }),
  orderList: [],
  setOrdersList: (orders) => set({ orderList: orders }),
});
