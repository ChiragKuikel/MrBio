import { MfaUserDetail } from '../../../user/domain/core/entities/mfa-user';

export type TokenResponse = {
  token: string;
};

export type MfaTokenResponse = {
  token: string;
  mfaEnabled: boolean;
};

export type MfaTokenPayload = {
  mfaId: string;
  user: MfaUserDetail;
};
