import { MfaAction } from '../core/entities/mfa';

export type GenerateOtpDto = {
  action: MfaAction;
  /**
   * Used to identify the user. Could be `email` or `username`
   */
  userIdentifier: string;
};
