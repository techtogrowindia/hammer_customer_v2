import { authClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { SendOtpResponse } from '@/domain/models/auth/send-otp-response';
import { VerifyOtpResponse } from '@/domain/models/auth/verify-otp-response';
import { IAuthRepository } from '@/domain/repositories/auth/IAuthRepository';

export const AuthRepository: IAuthRepository = {
  sendOTP: async ({ mobileNumber }: { mobileNumber: string }): Promise<SendOtpResponse> => {
    const response = await authClient.post(apiEndpoints.sendOtp, { mobile: mobileNumber });
    return response.data;
  },
  verifyOTP: async ({ otp, temp_id }: { otp: string; temp_id: string }): Promise<VerifyOtpResponse> => {
    const response = await authClient.post(apiEndpoints.verifyOtp, { otp, temp_id });
    return response.data;
  },
};
