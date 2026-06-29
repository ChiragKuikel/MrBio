import { AuthEntity } from '../types';
import { LogEventSubType } from '../enum';
import {
  ActivityLog,
  PublishActivityLogDto,
  PublishActivityLogEventDto,
} from '../types/activity-log';

export abstract class ActivityLogPublisher {
  abstract publishCreateLogEvent(
    createLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ): void;
  abstract publishUpdateLogEvent(
    updateLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ): void;
  abstract publishDeleteLogEvent(
    deleteLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ): void;
  abstract publishSearchLogEvent(
    searchLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ): void;
  abstract publishChangeLogEvent(
    eventSubType: LogEventSubType,
    changeLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ): void;
  abstract publishLogEvent(logDto: PublishActivityLogEventDto, authEntity?: AuthEntity): void;
  abstract publishActivityLogEvent(activityLog: ActivityLog, authEntity?: AuthEntity): void;
}
