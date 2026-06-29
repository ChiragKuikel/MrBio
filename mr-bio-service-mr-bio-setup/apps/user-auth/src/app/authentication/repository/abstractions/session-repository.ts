import { Session } from '../../domain/core/entities/session';
import { BaseRepository, ServiceOption } from '@mr-bio/core/shared';

export abstract class SessionRepository extends BaseRepository<Session> {
  abstract deleteUserDeviceSession(
    userId: string,
    deviceId?: string,
    option?: ServiceOption
  ): Promise<void>;
}
