import { StateCreator } from 'zustand';

export type uiSliceType = {
  hasHydrated: boolean;
  setHasHydrated: (hydrateFlag: boolean) => void;
  showAppLoader: boolean;
  toggleAppLoader: (toggle: boolean) => void;
  hasOnBoardCompleted: boolean;
  setHasOnBoardCompleted: (flag: boolean) => void;
};

export const createUISlice: StateCreator<uiSliceType> = (set, get) => ({
  hasHydrated: false,

  showAppLoader: false,
  hasOnBoardCompleted: false,

  setHasHydrated: (hasHydrated) => set({ hasHydrated }),

  toggleAppLoader: (toggle) => set({ showAppLoader: toggle }),

  setHasOnBoardCompleted: (flag) => set({ hasOnBoardCompleted: flag }),
});
