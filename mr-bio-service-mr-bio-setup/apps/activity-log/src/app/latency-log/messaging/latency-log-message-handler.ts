import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { EventTopic, LatencyLog, Logger } from '@mr-bio/core/shared';
import { LatencyLogService } from '../domain/abstractions/latency-log-service';
import { createLatencyLogSchema } from '../controllers/validations/create-latency-log';

@Controller()
export class LatencyLogMessageHandler {
  constructor(
    private latencyLogService: LatencyLogService,
    private logger: Logger
  ) {}

  @EventPattern(EventTopic.API_REQUEST_COMPLETED)
  async handleApiRequestCompleted(@Payload() message: LatencyLog) {
    this.logger.debug(`Message received for ${EventTopic.API_REQUEST_COMPLETED}`);
    const parsedResponse = createLatencyLogSchema.safeParse(message);

    if (parsedResponse.data) {
      this.logger.debug(`Adding api request log for ${message.endpoint}`);
      await this.latencyLogService.create(parsedResponse.data as LatencyLog);
    } else {
      this.logger.error(
        `Invalid data format received for ${EventTopic.API_REQUEST_COMPLETED}`,
        parsedResponse.error.format()
      );
    }
  }
}
