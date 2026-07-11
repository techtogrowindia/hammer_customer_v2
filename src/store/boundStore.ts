import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { uiSliceType } from './uiSlice';

type StoreState = uiSliceType;

export const useBoundStore = create<StoreState>()(
  persist((...a) => ({}), {
    name: 'react-native-store',
    storage: createJSONStorage(() => AsyncStorage),
    partialize: (state) => ({}),
    onRehydrateStorage: (state) => () => state.setHasHydrated(true),
  }),
);
