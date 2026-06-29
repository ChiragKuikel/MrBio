import { Injectable } from '@nestjs/common';
import { ServiceOption } from '@mr-bio/core/shared';
import { SessionModel } from './models/session-model';
import { SessionSchema } from './schemas/session-schema';
import { Session } from '../domain/core/entities/session';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { SessionRepository } from './abstractions/session-repository';
import { SessionPersistenceMapper } from './mappers/session-persistence-mapper';

@Injectable()
export class SessionRepositoryImpl
  extends BaseRepositoryImpl<Session, SessionSchema>
  implements SessionRepository
{
  constructor(
    protected model: SessionModel,
    protected mapper: SessionPersistenceMapper
  ) {
    super(model, mapper);
  }

  async deleteUserDeviceSession(
    userId: string,
    deviceId?: string | undefined,
    option?: ServiceOption | undefined
  ): Promise<void> {
    await this.model.model?.deleteMany({ userId, ...(deviceId && { deviceId }) }, option);
  }
}
