export interface OtpGeneratedMessage {
  otp: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  email: string;
}

export interface ResetPasswordMessage {
  firstName: string;
  email: string;
  resetPasswordLink: string;
}

export interface AccountActivationMessage {
  firstName: string;
  email: string;
  verificationLink: string;
}
