import { Inject } from '@nestjs/common';
import { AuthEntity } from '../domain/types';
import { ClientKafka } from '@nestjs/microservices';
import { instanceOfT, isEmpty, resolveAssigner, toTitleCase } from '../domain/utils';
import { ActivityLogPublisher as ActivityLogPublisher } from '../domain/abstractions';
import { EventTopic, LogEventSubType, LogSeverity, LogType, ProjectModule } from '../domain/enum';
import {
  ActivityLog,
  LogAttribute,
  LogBulkAttr,
  LogKeywordSearchAttr,
  LogModuleWrapper,
  PublishActivityLogDto,
  PublishActivityLogEventDto,
} from '../domain/types/activity-log';

export class ActivityLogPublisherImpl implements ActivityLogPublisher {
  private DEFAULT_LOG_TYPE: LogType = 'INFORMATION';
  private DEFAULT_LOG_SEVERITY: LogSeverity = 'MEDIUM';

  constructor() {} // @Inject(KAFKA_CLIENT_NAME) private client: ClientKafka

  publishCreateLogEvent(createLogDto: PublishActivityLogDto, authEntity?: AuthEntity): void {
    if (!isEmpty(createLogDto)) {
      const activityLog = this._prepareActivityLog(
        {
          ...createLogDto,
          eventType: 'ADD',
          note:
            createLogDto.note ??
            `${createLogDto.subModule ?? createLogDto.module} added successfully!`,
          eventSubType: instanceOfT<LogBulkAttr>(createLogDto.attributes?.data, 'dataList')
            ? 'BULK'
            : undefined,
          attributes: {
            ...createLogDto.attributes,
            reference: {
              ...createLogDto.attributes?.reference,
              projectModule: createLogDto.module,
            },
          },
        },
        authEntity
      );

      this._publishEvent(activityLog);
    }
  }

  publishUpdateLogEvent(updateLogDto: PublishActivityLogDto, authEntity?: AuthEntity): void {
    if (!isEmpty(updateLogDto)) {
      const activityLog = this._prepareActivityLog(
        {
          ...updateLogDto,
          eventType: 'UPDATE',
          note:
            updateLogDto.note ??
            `${updateLogDto.subModule ?? updateLogDto.module} updated successfully!`,
          eventSubType: instanceOfT<LogBulkAttr>(updateLogDto.attributes?.data, 'dataList')
            ? 'BULK'
            : undefined,
          attributes: {
            ...updateLogDto.attributes,
            reference: {
              ...updateLogDto.attributes?.reference,
              projectModule: updateLogDto.module,
            },
          },
        },
        authEntity
      );

      this._publishEvent(activityLog);
    }
  }

  publishDeleteLogEvent(deleteLogDto: PublishActivityLogDto, authEntity?: AuthEntity): void {
    if (!isEmpty(deleteLogDto)) {
      const activityLog = this._prepareActivityLog(
        {
          ...deleteLogDto,
          eventType: 'DELETE',
          eventSubType: 'SOFT',
          note:
            deleteLogDto.note ??
            `${deleteLogDto.subModule ?? deleteLogDto.module} deleted successfully!`,
          attributes: {
            ...deleteLogDto.attributes,
            reference: {
              ...deleteLogDto.attributes?.reference,
              projectModule: deleteLogDto.module,
            },
          },
        },
        authEntity
      );

      this._publishEvent(activityLog);
    }
  }

  publishSearchLogEvent(searchLogDto: PublishActivityLogDto, authEntity?: AuthEntity): void {
    if (!isEmpty(searchLogDto) && searchLogDto.attributes?.data) {
      const activityLog = this._prepareActivityLog(
        {
          ...searchLogDto,
          eventType: 'SEARCH',
          note:
            searchLogDto.note ??
            `${searchLogDto.subModule ?? searchLogDto.module} searched successfully!`,
          eventSubType: instanceOfT<LogKeywordSearchAttr>(searchLogDto.attributes?.data, 'keyword')
            ? 'KEYWORD'
            : 'ADVANCED',
        },
        authEntity
      );

      this._publishEvent(activityLog);
    }
  }

  publishChangeLogEvent(
    eventSubType: LogEventSubType,
    changeLogDto: PublishActivityLogDto,
    authEntity?: AuthEntity
  ) {
    if (!isEmpty(changeLogDto)) {
      const activityLog = this._prepareActivityLog(
        {
          ...changeLogDto,
          eventSubType,
          eventType: 'CHANGE',
          note:
            changeLogDto.note ??
            `${changeLogDto.module} ${toTitleCase(eventSubType)} changed successfully!`,
        },
        authEntity
      );

      this._publishEvent(activityLog);
    }
  }

  publishLogEvent(logDto: PublishActivityLogEventDto, authEntity?: AuthEntity): void {
    if (!isEmpty(logDto)) {
      this._publishEvent(this._prepareActivityLog(logDto, authEntity));
    }
  }

  publishActivityLogEvent(activityLog: ActivityLog, authEntity?: AuthEntity): void {
    this._publishEvent(this._resolveActivityLog(activityLog, authEntity));
  }

  private _prepareActivityLog(
    logEventPayload: PublishActivityLogEventDto,
    authEntity?: AuthEntity
  ): ActivityLog {
    const activityLog: ActivityLog = {
      logged: logEventPayload.logged,
      severity: logEventPayload.severity,
      userVisibility: logEventPayload?.userVisibility,
      event: {
        type: logEventPayload.eventType,
        subType: logEventPayload.eventSubType ?? '',
      },
      log: {
        ...this._mapLogModule(logEventPayload.module),
        note: logEventPayload.note,
        type: logEventPayload.type,
        attributes: logEventPayload.attributes ?? {},
      },
    };

    return this._resolveActivityLog(activityLog, authEntity);
  }

  private _resolveActivityLog(activityLog: ActivityLog, authEntity?: AuthEntity): ActivityLog {
    if (!activityLog.severity) activityLog.severity = this.DEFAULT_LOG_SEVERITY;
    if (!activityLog.log?.type)
      activityLog.log = { ...activityLog.log, type: this.DEFAULT_LOG_TYPE };

    if (!activityLog.log?.note)
      activityLog.log = {
        ...activityLog.log,
        note: toTitleCase(
          `${activityLog.event?.type} ${activityLog.log?.subModule ?? activityLog.log?.module}`
        ),
      };

    if (!activityLog.logged)
      // activityLog.logged = {
      //   at: new Date(),
      //   ...(authEntity ? { id: authEntity.id, by: authEntity.fullName } : { by: SYSTEM }),
      // };
      activityLog.logged = resolveAssigner({ authEntity });

    if (!activityLog.tags?.length) activityLog.tags = this._generateLogTags(activityLog);

    return activityLog;
  }

  private _mapLogModule(projectModule: ProjectModule): LogModuleWrapper {
    switch (projectModule) {
      case ProjectModule.USER:
        return { module: 'USER' };

      case ProjectModule.ROLE:
        return { module: 'ROLE_PERMISSION' };

      default:
        return { module: <any>projectModule };
    }
  }

  private _publishEvent(activityLog: ActivityLog): void {
    // this.client.emit(EventTopic.LOG_ADDED, activityLog);
  }

  private _generateAttributeTags(logAttribute: LogAttribute): string[] {
    if (!logAttribute) return [];

    // Extract keyword from attributes data
    if (instanceOfT<LogKeywordSearchAttr>(logAttribute, 'keyword')) {
      return typeof logAttribute.keyword === 'string'
        ? logAttribute.keyword.toLowerCase().split(' ')
        : logAttribute.keyword.map(x => x.toLowerCase());
    }

    if (instanceOfT<LogBulkAttr>(logAttribute, 'source') && logAttribute.source?.projectModule) {
      return [logAttribute.source?.projectModule.toLowerCase()];
    }

    if (logAttribute.data && typeof logAttribute.data == 'object') {
      return Object.keys(logAttribute.data).map(x => x.toLowerCase());
    }

    return [];
  }

  private _generateLogTags(activityLog: ActivityLog): string[] {
    if (!activityLog) return [];

    const tags: Set<string> = new Set();

    // Extract keywords from note
    if (activityLog.log?.note) {
      const noteKeywords: string[] = activityLog.log?.note.toLowerCase().split(' ');
      noteKeywords.forEach(keyword => tags.add(keyword));
    }

    // Extract keywords from module
    const moduleKeywords: string[] = activityLog.log?.module.toLowerCase().split(' ');
    moduleKeywords.forEach(keyword => tags.add(keyword));

    // Extract keyword from attributes data
    const attributeKeywords: string[] = this._generateAttributeTags(activityLog.log?.attributes);
    attributeKeywords.forEach(keyword => tags.add(keyword));

    return Array.from(tags);
  }
}
