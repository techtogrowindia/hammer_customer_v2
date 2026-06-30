import { apiClient } from '@/data/api/api-client';
import { apiEndpoints } from '@/data/api/api-endpoints';
import { IAuthRepository } from '@/domain/repositories/auth/IAuthRepository';

export const AuthRepository: IAuthRepository = {
  sendOTP: async ({ mobileNumber }: { mobileNumber: string }): Promise<any> => {
    const response = await apiClient.post(apiEndpoints.sendOtp);
    return response.data;
  },
};
