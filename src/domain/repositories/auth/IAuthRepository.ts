import { SendOtpResponse } from '@/domain/models/auth/send-otp-response';

export interface IAuthRepository {
  sendOTP: ({ mobileNumber }: { mobileNumber: string }) => Promise<SendOtpResponse>;
}
