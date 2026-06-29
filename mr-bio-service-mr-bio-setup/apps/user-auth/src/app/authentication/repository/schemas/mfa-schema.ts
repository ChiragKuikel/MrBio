import { BaseSchema } from '@mr-bio/core/external-lib';
import { MfaAction, MfaType } from '../../domain/core/entities/mfa';

export interface IMfa {
  mfaId: string;
  code: string;
  expirationTime: Date;
  isUsed: boolean;
  isVerified: boolean;
  type: MfaType;
  action: MfaAction;
}

export type MfaSchema = IMfa & BaseSchema;
