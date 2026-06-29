import { MfaAction } from '../core/entities/mfa';

export type VerifyOtpDto = {
  code: string;
  token: string;
  action: MfaAction;
};
