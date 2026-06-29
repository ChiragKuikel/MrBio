import { Injectable } from '@nestjs/common';
import { SessionSchema } from '../schemas/session-schema';
import { BasePersistenceMapper } from '@mr-bio/core/shared';
import { Session } from '../../domain/core/entities/session';

@Injectable()
export class SessionPersistenceMapper extends BasePersistenceMapper<Session, SessionSchema> {
  domainToPersistence(domain: Session): SessionSchema {
    return {
      sessionId: domain.id,
      userId: domain.userId,
      revoked: domain.revoked,
      deviceId: domain.deviceId,
      remember: domain.remember,
    };
  }

  persistenceToDomain(persistence: SessionSchema): Session {
    const domain = new Session(persistence.sessionId);
    domain.userId = persistence.userId;
    domain.deviceId = persistence.deviceId;
    domain.remember = persistence.remember;
    domain.revoked = persistence.revoked;

    return domain;
  }
}
