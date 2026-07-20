import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { addressSliceType, createAddressSlice } from './addressSlice';
import { createServiceCatSlice, serviceCatSliceType } from './serviceCatSlice';
import { createUISlice, uiSliceType } from './uiSlice';
import { UserSliceType, createUserSlice } from './userSlice';

type StoreState = uiSliceType & UserSliceType & addressSliceType & serviceCatSliceType;

export const useBoundStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createUISlice(...a),
      ...createUserSlice(...a),
      ...createAddressSlice(...a),
      ...createServiceCatSlice(...a),
    }),
    {
      name: 'react-native-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        userInfo: state.userInfo,
        hasOnBoardCompleted: state.hasOnBoardCompleted,
        addressList: state.addressList,
        userToken: state.userToken,
      }),
      onRehydrateStorage: (state) => () => state.setHasHydrated(true),
    },
  ),
);
