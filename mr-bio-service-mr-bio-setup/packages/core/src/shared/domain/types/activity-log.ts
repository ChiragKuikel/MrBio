import { Assigner } from './assigner';
import { AnyObj, Blank, ChangedData } from './object';
import {
  LogEventSubType,
  LogEventType,
  LogModule,
  LogSeverity,
  LogType,
  ProjectModule,
} from '../enum';

export interface LogBulkAttr {
  source?: LogReference & AnyObj;
  dataList: ({ refId: string } & AnyObj)[];
}

export type LogKeywordSearchAttr = {
  keyword: string | string[];
};

export type LogReference = {
  refId?: string;
  projectModule: ProjectModule;
};

export type LogAttribute = {
  reference?: LogReference;
  data?: LogKeywordSearchAttr | LogBulkAttr | ChangedData | AnyObj;
};

export type LogModuleWrapper = {
  module: LogModule;
  subModule?: Blank<LogModule>;
};

export type Log = LogModuleWrapper & {
  note?: string;
  attributes: LogAttribute;
  type?: LogType;
};

export type ActivityLog = {
  event: {
    type: LogEventType;
    subType?: Blank<LogEventSubType>;
  };
  log: Log;
  userVisibility?: boolean;
  severity?: LogSeverity;
  tags?: string[];
  logged?: Assigner;
};

export type PublishActivityLogDto = {
  module: ProjectModule; //references lookups(code) where category=LOG and subCategory=MODULE
  subModule?: ProjectModule; //references lookups(code) where category=LOG and subCategory=MODULE

  note?: string;
  attributes?: LogAttribute;

  type?: LogType; //references lookups(code) where category=LOG and subCategory=TYPE
  userVisibility: boolean;
  severity?: LogSeverity; //references lookups(code) where category=LOG and subCategory=SEVERITY

  tags?: string[];
  logged?: Assigner;
};

export type PublishActivityLogEventDto = PublishActivityLogDto & {
  eventType: LogEventType; //references lookups(code) where category=LOG and subCategory=EVENT_TYPE
  eventSubType?: LogEventSubType; //references lookups(code) where category=LOG and subCategory=EVENT_SUB_TYPE
};
