export interface IAuthRepository {
  sendOTP: ({ mobileNumber }: { mobileNumber: string }) => Promise<any>;
}
