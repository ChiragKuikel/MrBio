import { Environment, ExceptionLevel, HttpMethod } from '../../../shared';

export type ExceptionLog = {
  timestamp: Date;
  application: ILogApplication;
  environment: Environment;
  level: ExceptionLevel;
  message: string;
  request: {
    method: HttpMethod;
    url: string;
    headers: Record<string, any>;
    body: any;
    queryParams: Record<string, any>;
    ipAddress: string;
  };
  response: {
    statusCode: number;
    headers?: Record<string, any>;
  };
  user?: {
    userId?: string;
    email?: string;
    roles: string[];
  };
  exception: {
    type: string;
    message: string;
    stackTrace?: string;
  };
  meta: {
    service: string;
    host: string;
    tags: string[];
    correlationId?: string;
  };
};
export type ILogApplication = {
  name: string;
  id: string;
};
export type ExceptionLogDto = {};
