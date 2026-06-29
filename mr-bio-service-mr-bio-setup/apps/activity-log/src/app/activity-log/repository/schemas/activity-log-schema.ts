import { BaseSchema } from '@mr-bio/core/external-lib';
import {
  Assigner,
  Blank,
  Log,
  LogEventSubType,
  LogEventType,
  LogSeverity,
} from '@mr-bio/core/shared';

export interface IActivityLog {
  activityLogId: string;
  event: {
    type: LogEventType;
    subType?: Blank<LogEventSubType>;
  };
  log: Log;
  userVisibility?: boolean;
  severity?: LogSeverity;
  tags?: string[];
  logged?: Assigner;
}

export type ActivityLogSchema = IActivityLog & BaseSchema;
