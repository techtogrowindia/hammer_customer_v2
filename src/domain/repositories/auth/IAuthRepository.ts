import { SendOtpResponse } from '@/domain/models/auth/send-otp-response';
import { VerifyOtpResponse } from '@/domain/models/auth/verify-otp-response';

export interface IAuthRepository {
  sendOTP: ({ mobileNumber }: { mobileNumber: string }) => Promise<SendOtpResponse>;
  verifyOTP: ({ otp, temp_id }: { otp: string; temp_id: string }) => Promise<VerifyOtpResponse>;
}
