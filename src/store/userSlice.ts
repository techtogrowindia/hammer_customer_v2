import { VerifyOtpData } from '@/domain/models/auth/verify-otp-response';
import { StateCreator } from 'zustand';

export type UserSliceType = {
  userInfo: VerifyOtpData | null;
  isLoggedIn: boolean;
  userToken: string | null;

  updateUserInfo: (user: VerifyOtpData) => void;
  setIsLoggedIn: (flag: boolean) => void;
  setUserToken: (token: string | null) => void;
  clearUserInfo: () => void;
};

export const createUserSlice: StateCreator<UserSliceType> = (set) => ({
  userInfo: null,
  isLoggedIn: false,
  userToken: null,

  setUserToken: (token) =>
    set({
      userToken: token,
    }),

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
      userToken: null,
    }),
});
