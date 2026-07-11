import { AuthRepository } from '@/data/repositories/auth/auth-repository';

export const useAuthApisHelper = () => {
  const sendOTP = async (mobileNumber: string) => {
    try {
      const response = await AuthRepository.sendOTP({ mobileNumber });

      if (!response?.success) {
        throw new Error(response?.message);
      }
      return response;
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error;
    }
  };

  return {
    sendOTP,
  };
};
