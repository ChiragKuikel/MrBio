import { hostname } from 'os';
import { ClientKafka } from '@nestjs/microservices';
import { Injectable, Inject } from '@nestjs/common';
import { ExceptionLog } from '../domain/types/exception-log';
import { ExceptionLogPublisher } from '../domain/abstractions/exception-log-publisher';
import { Environment, EventTopic, ExceptionLevel, HttpMethod, HttpRequest, HttpResponse } from '..';
import {
  BaseConfigService,
  // getOrganizationInfo,
  getCurrentUTCDate,
  getFullUrl,
  getIpFromRequest,
} from '..';

@Injectable()
export class ExceptionLogPublisherImpl implements ExceptionLogPublisher {
  constructor(
    // @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
    private readonly configService: BaseConfigService
  ) {}

  async publishExceptionEvent(
    request: HttpRequest,
    response: HttpResponse,
    message: string,
    error?: Error
  ): Promise<void> {
    const ipAddress = getIpFromRequest(request);
    const exceptionLog: ExceptionLog = {
      timestamp: getCurrentUTCDate(),
      environment: this.configService.app.env as Environment,
      meta: {
        tags: [],
        host: hostname(),
        service: this.configService.app.serviceName,
      },
      application: {
        name: this.configService.app.serviceName,
        id: 'N/A',
      },
      level: ExceptionLevel.ERROR,
      message,
      response: {
        headers: response.header,
        statusCode: response.statusCode,
      },
      exception: {
        type: error?.name || '',
        message: error?.message || '',
        stackTrace: error?.stack || '',
      },
      request: {
        ipAddress,
        url: getFullUrl(request),
        body: request.body,
        headers: request.headers,
        method: request.method as HttpMethod,
        queryParams: Object.fromEntries(new URLSearchParams(request.url.split('?')[1])),
      },
      // TODO: Add entity info
      // user: {
      //   userId: request.authUser?.id || 'N/A',
      //   email: request.authUser?.email,
      //   roles: request.authUser?.roles || [],
      // },
    };
    // this.client.emit(EventTopic.EXCEPTION_LOG_ADDED, exceptionLog);
  }
}
