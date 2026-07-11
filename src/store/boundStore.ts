import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createUISlice, uiSliceType } from './uiSlice';
import { UserSliceType, createUserSlice } from './userSlice';

type StoreState = uiSliceType & UserSliceType;

export const useBoundStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createUserSlice(...a),
    }),
    {
      name: 'react-native-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
        hasOnBoardCompleted: state.hasOnBoardCompleted,
      }),
      onRehydrateStorage: (state) => () => state.setHasHydrated(true),
    },
  ),
);
