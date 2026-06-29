export type LogSeverity = 'HIGH' | 'MEDIUM' | 'LOW';

export type LogType = 'INFORMATION' | 'WARNING' | 'ERROR';

export type LogEventType =
  | 'LOGIN'
  | 'LOGOUT'
  | 'SEARCH'
  | 'ADD'
  | 'UPDATE'
  | 'DELETE'
  | 'CHANGE'
  | 'ASSIGN'
  | 'UNASSIGN'
  | 'INVITE';

export type LogEventSubType =
  | 'KEYWORD'
  | 'ADVANCED'
  | 'BULK'
  | 'SOFT'
  | 'HARD'
  | 'REPRESENTATIVE'
  | 'PASSWORD'
  | 'STATUS'
  | 'PERMISSION';

export type LogModule = 'USER' | 'ROLE_PERMISSION' | 'AUTH';
