export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: VerifyOtpData;
  token: string;
}

export interface VerifyOtpData {
  id: number;
  name: string;
  mobile: string;
  email: string;
  mobile_verified: boolean;
}
