import { GCCategory } from '@/domain/models/service-categories/getCategoriesResponse';
import { StateCreator } from 'zustand';

export type serviceCatSliceType = {
  showSCModuleLoader: boolean;
  toggleSCModuleLoader: (toggle: boolean) => void;
  categoryList: GCCategory[];
  setCategoryList: (categories: GCCategory[]) => void;
};
export const createServiceCatSlice: StateCreator<serviceCatSliceType> = (set, get) => ({
  showSCModuleLoader: false,
  toggleSCModuleLoader: (toggle) => set({ showSCModuleLoader: toggle }),
  categoryList: [],
  setCategoryList: (categories) => set({ categoryList: categories }),
});
