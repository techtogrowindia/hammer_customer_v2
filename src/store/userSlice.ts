import { VerifyOtpData } from '@/domain/models/auth/verify-otp-response';
import { StateCreator } from 'zustand';

export type UserSliceType = {
  userInfo: VerifyOtpData | null;
  isLoggedIn: boolean;

  updateUserInfo: (user: VerifyOtpData) => void;
  setIsLoggedIn: (flag: boolean) => void;
  clearUserInfo: () => void;
};

export const createUserSlice: StateCreator<UserSliceType> = (set) => ({
  userInfo: null,
  isLoggedIn: false,

  setIsLoggedIn: (flag) =>
    set({
      isLoggedIn: flag,
    }),

  updateUserInfo: (user) =>
    set((state) => ({
      userInfo: state.userInfo ? { ...state.userInfo, ...user } : user,
    })),

  clearUserInfo: () =>
    set({
      userInfo: null,
      isLoggedIn: false,
    }),
});
