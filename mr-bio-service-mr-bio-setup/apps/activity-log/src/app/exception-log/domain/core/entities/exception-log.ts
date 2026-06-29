import { CreateExceptionLogDto } from '../../dtos/create-exception-log';
import { BaseEntity, Environment, ExceptionLevel, HttpMethod } from '@mr-bio/core/shared';

export class ExceptionLog extends BaseEntity {
  timestamp: Date;
  application: {
    name: string;
    id: string;
  };
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
  response?: {
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
  meta?: {
    service: string;
    host: string;
    tags: string[];
    correlationId?: string;
  };

  initialize(createDto: CreateExceptionLogDto) {
    this.timestamp = createDto.timestamp;
    this.application = createDto.application;
    this.environment = createDto.environment;
    this.level = createDto.level;
    this.request = createDto.request;
    this.response = createDto.response;
    this.user = createDto.user;
    this.exception = createDto.exception;
    this.meta = createDto.meta;
    this.message = createDto.message;
  }
}
