import {
  Assigner,
  BaseEntity,
  Blank,
  Log,
  LogEventSubType,
  LogEventType,
  LogSeverity,
} from '@mr-bio/core/shared';

export type ActivityLogEvent = {
  type: LogEventType;
  subType?: Blank<LogEventSubType>;
};

export class ActivityLog extends BaseEntity {
  event: ActivityLogEvent;
  log: Log;
  userVisibility?: boolean;
  severity?: LogSeverity;
  tags?: string[];
  logged?: Assigner;

  initialize(builder: {
    event: ActivityLogEvent;
    log: Log;
    userVisibility?: boolean;
    severity?: LogSeverity;
    tags?: string[];
    logged?: Assigner;
  }) {
    this.event = builder.event;
    this.log = builder.log;
    this.userVisibility = builder.userVisibility;
    this.severity = builder.severity;
    this.tags = builder.tags;
    this.logged = builder.logged;
  }
}
