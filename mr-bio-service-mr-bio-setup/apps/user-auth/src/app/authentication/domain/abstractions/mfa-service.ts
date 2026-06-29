import { ServiceOption } from '@mr-bio/core/shared';
import { MfaTokenPayload } from '../dtos/token-response';
import { MfaAction, MfaType } from '../core/entities/mfa';
import { CreateMfaDto, UseMfaDto, VerifyMfaDto } from '../dtos/mfa';
import { MfaUser } from '../../../user/domain/core/entities/mfa-user';

export type CreatedMfa = {
  user: MfaUser;
  token: string;
  code: string;
  action: MfaAction;
  type: MfaType;
};

export type VerifiedMfa = {
  verificationToken: string;
};

export abstract class MfaService {
  abstract createMfa(createMfaDto: CreateMfaDto, option?: ServiceOption): Promise<CreatedMfa>;

  abstract verifyMfa(verifyMfaDto: VerifyMfaDto, option?: ServiceOption): Promise<VerifiedMfa>;

  abstract useMfa(useMfaDto: UseMfaDto, option?: ServiceOption): Promise<MfaTokenPayload>;

  abstract verifyAndUse(
    verifyMfaDto: VerifyMfaDto,
    option?: ServiceOption
  ): Promise<MfaTokenPayload>;
}
