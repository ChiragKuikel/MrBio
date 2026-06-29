import { Mfa } from './core/entities/mfa';
import { Injectable } from '@nestjs/common';
import { MfaTokenPayload } from './dtos/token-response';
import { errorMessage } from '../../../shared/constants';
import { CreateMfaDto, UseMfaDto, VerifyMfaDto } from './dtos/mfa';
import { MfaRepository } from '../repository/abstractions/mfa-repository';
import { CreatedMfa, MfaService, VerifiedMfa } from './abstractions/mfa-service';
import { CryptoHelper, ServiceOption, UnauthorizedException } from '@mr-bio/core/shared';
import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';

@Injectable()
export class MfaServiceImpl implements MfaService {
  constructor(
    private mfaRepository: MfaRepository,
    private cryptoHelper: CryptoHelper,
    private configService: UserAuthConfigService
  ) {}

  async createMfa(createMfaDto: CreateMfaDto, option?: ServiceOption): Promise<CreatedMfa> {
    const mfa = new Mfa();
    mfa.initialize({
      action: createMfaDto.action,
      type: createMfaDto.type,
    });

    await this.mfaRepository.create(mfa, option);

    const mfaTokenPayload: MfaTokenPayload = {
      mfaId: mfa.id,
      user: createMfaDto.user.details,
    };

    const token = this.cryptoHelper.encrypt(mfaTokenPayload, this.configService.auth.mfaTokenKey);

    const createdMfa: CreatedMfa = {
      token: token,
      code: mfa.code,
      user: createMfaDto.user,
      action: mfa.action,
      type: mfa.type,
    };

    return createdMfa;
  }

  async verifyMfa(verifyMfaDto: VerifyMfaDto, option?: ServiceOption): Promise<VerifiedMfa> {
    const mfaTokenPayload = this.cryptoHelper.decrypt<MfaTokenPayload>(
      verifyMfaDto.token,
      this.configService.auth.mfaTokenKey
    );

    const mfa = await this.mfaRepository.findOneById(mfaTokenPayload.mfaId, option);

    const isMfaInvalid =
      !mfa ||
      mfa.isVerified ||
      mfa.type !== verifyMfaDto.type ||
      mfa.action !== verifyMfaDto.action;

    if (isMfaInvalid) {
      throw new UnauthorizedException(errorMessage.TOKEN_INVALID);
    }

    if (mfa.hasExpired) {
      throw new UnauthorizedException(errorMessage.LINK_EXPIRED);
    }

    if (mfa.isOneTimePassword) {
      if (mfa.code !== verifyMfaDto.code) {
        throw new UnauthorizedException(errorMessage.OTP_INVALID);
      }
    }

    await this.mfaRepository.updateById(mfaTokenPayload.mfaId, { isVerified: true }, option);

    const verificationToken = this.cryptoHelper.encrypt(
      mfaTokenPayload,
      this.configService.auth.mfaTokenKey
    );

    return { verificationToken };
  }

  async useMfa(useMfaDto: UseMfaDto, option?: ServiceOption): Promise<MfaTokenPayload> {
    const mfaTokenPayload = this.cryptoHelper.decrypt<MfaTokenPayload>(
      useMfaDto.verificationToken,
      this.configService.auth.mfaTokenKey
    );

    const mfa = await this.mfaRepository.findOneById(mfaTokenPayload.mfaId, option);

    const isMfaInvalid = !mfa || !mfa.isVerified || mfa.isUsed || mfa.action !== useMfaDto.action;

    if (isMfaInvalid) {
      throw new UnauthorizedException(errorMessage.TOKEN_INVALID);
    }

    if (mfa.hasExpired) {
      throw new UnauthorizedException(errorMessage.LINK_EXPIRED);
    }

    await this.mfaRepository.deleteById(mfaTokenPayload.mfaId, option);

    return mfaTokenPayload;
  }

  async verifyAndUse(verifyMfaDto: VerifyMfaDto, option?: ServiceOption): Promise<MfaTokenPayload> {
    const verifiedMfa = await this.verifyMfa(verifyMfaDto, option);

    return this.useMfa(
      {
        action: verifyMfaDto.action,
        verificationToken: verifiedMfa.verificationToken,
      },
      option
    );
  }
}
