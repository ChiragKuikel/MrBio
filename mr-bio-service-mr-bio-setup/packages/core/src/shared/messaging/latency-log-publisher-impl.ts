import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { LatencyLog } from '../domain/types/latency-log';
import { LatencyLogPublisher } from '../domain/abstractions/latency-log-publisher';
import {
  BaseConfigService,
  Environment,
  EventTopic,
  getCurrentUTCDate,
  getFullUrl,
  HttpMethod,
  HttpRequest,
  HttpResponse,
} from '../domain';

@Injectable()
export class LatencyLogPublisherImpl implements LatencyLogPublisher {
  constructor(
    // @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka,
    private readonly configService: BaseConfigService
  ) {}

  async publishApiRequestCompletionEvent(
    request: HttpRequest,
    response: HttpResponse,
    responseTimeMs: number
  ): Promise<void> {
    // const ipAddress = getIpFromRequest(request);
    const latencyLog: LatencyLog = {
      timestamp: getCurrentUTCDate(),
      endpoint: getFullUrl(request),
      method: request.method as HttpMethod,
      responseTimeMs,
      statusCode: response.statusCode,
      environment: this.configService.app.env as Environment,
      application: {
        name: this.configService.app.serviceName,
        id: 'N/A',
      },
      request: {
        headers: request.headers,
        queryParams: Object.fromEntries(new URLSearchParams(request.url.split('?')[1])),
        body: request.body,
      },
      // TODO: Add entity info
      // user: {
      //   userId: request.authUser?.id || 'N/A',
      //   roles: request.authUser?.roles || [],
      //   ipAddress,
      // },
      meta: {
        tags: [],
      },
    };
    // this.client.emit(EventTopic.API_REQUEST_COMPLETED, latencyLog);
  }
}
