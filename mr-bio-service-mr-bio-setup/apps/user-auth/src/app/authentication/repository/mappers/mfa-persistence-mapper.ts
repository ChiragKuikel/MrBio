import { Injectable } from '@nestjs/common';
import { MfaSchema } from '../schemas/mfa-schema';
import { Mfa } from '../../domain/core/entities/mfa';
import { BasePersistenceMapper } from '@mr-bio/core/shared';

@Injectable()
export class MfaPersistenceMapper extends BasePersistenceMapper<Mfa, MfaSchema> {
  domainToPersistence(domain: Mfa): MfaSchema {
    return {
      mfaId: domain.id,
      code: domain.code,
      type: domain.type,
      isUsed: domain.isUsed,
      action: domain.action,
      expirationTime: domain.expirationTime,
      isVerified: domain.isVerified,
    };
  }

  persistenceToDomain(persistence: MfaSchema): Mfa {
    const domain = new Mfa(persistence.mfaId);
    domain.code = persistence.code;
    domain.expirationTime = persistence.expirationTime;
    domain.isUsed = persistence.isUsed;
    domain.type = persistence.type;
    domain.action = persistence.action;
    domain.isVerified = persistence.isVerified;

    return domain;
  }
}
