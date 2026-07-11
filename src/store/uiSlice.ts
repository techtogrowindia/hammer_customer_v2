import { StateCreator } from 'zustand';

export type uiSliceType = {
  hasHydrated: boolean;
  setHasHydrated: (hydrateFlag: boolean) => void;
  showAppLoader: boolean;
  toggleAppLoader: (toggle: boolean) => void;
};

export const createUISlice: StateCreator<uiSliceType> = (set, get) => ({
  hasHydrated: false,

  showAppLoader: false,

  setHasHydrated: (hasHydrated) => set({ hasHydrated }),

  toggleAppLoader: (toggle) => set({ showAppLoader: toggle }),
});
