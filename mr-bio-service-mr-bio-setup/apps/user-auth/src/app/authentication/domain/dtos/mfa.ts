import { MfaAction, MfaType } from '../core/entities/mfa';
import { MfaUser } from '../../../user/domain/core/entities/mfa-user';

export type CreateMfaDto = {
  action: MfaAction;
  type: MfaType;
  user: MfaUser;
};

export type VerifyMfaDto = {
  action: MfaAction;
  type: MfaType;
  token: string;
  /**
   * Required for one time password
   */
  code?: string;
};

export type UseMfaDto = {
  verificationToken: string;
  action: MfaAction;
};
