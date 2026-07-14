import { AppColors } from '@/core/theme/app-colors';
import { isEmpty } from '@/core/utils/isEmpty';
import { AuthRepository } from '@/data/repositories/auth/auth-repository';
import { useBoundStore } from '@/store/boundStore';
import { router } from 'expo-router';
import { toastiva } from 'toastiva';
import { useShallow } from 'zustand/shallow';

export const useAuthApisHelper = () => {
  const { toggleAppLoader, updateUserInfo, setIsLoggedIn } = useBoundStore(
    useShallow((state) => ({
      toggleAppLoader: state.toggleAppLoader,
      updateUserInfo: state.updateUserInfo,
      setIsLoggedIn: state.setIsLoggedIn,
    })),
  );
  const sendOTP = async ({ mobileNumber, isFromReSend }: { mobileNumber: string; isFromReSend?: boolean }) => {
    toggleAppLoader(true);
    try {
      const response = await AuthRepository.sendOTP({ mobileNumber });

      if (!response?.success) {
        throw new Error(response?.message);
      }
      if (!response?.temp_id) {
        throw new Error('Temporary ID is missing in the response.');
      }

      if (response.success && !isFromReSend) {
        router.push({ pathname: '/otp/verify-otp', params: { mobile: mobileNumber, temp_id: response.temp_id } });
      }
      return response;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || 'Unable to send OTP. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });
      console.error('Error sending OTP:', error);
      throw error;
    } finally {
      toggleAppLoader(false);
    }
  };
  const verifyOTP = async ({ otp, temp_id }: { otp: string; temp_id: string }) => {
    toggleAppLoader(true);
    try {
      const response = await AuthRepository.verifyOTP({ otp, temp_id });

      if (!response?.success) {
        throw new Error(response?.message);
      }

      if (response?.success && response?.token && !isEmpty(response?.data)) {
        setIsLoggedIn(true);
        updateUserInfo(response?.data);
        // router.replace('/profile/complete-profile');
        router.replace('/(tabs)/(home)');
      } else {
        throw new Error('Invalid response from server. Missing token or user data.');
      }
      return response;
    } catch (error: any) {
      const message =
        error?.response?.data?.message || error?.message || 'Unable to verify OTP. Please try again later.';

      toastiva.error(message, {
        fill: AppColors.white,
        styles: {
          title: { color: AppColors.error },
        },
        showProgress: false,
      });

      console.error('Error Verifying OTP:', error);
      throw error;
    } finally {
      toggleAppLoader(false);
    }
  };

  return {
    sendOTP,
    verifyOTP,
  };
};
