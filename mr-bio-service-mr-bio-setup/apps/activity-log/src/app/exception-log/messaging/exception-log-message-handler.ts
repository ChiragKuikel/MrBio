import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ExceptionLog, EventTopic, Logger } from '@mr-bio/core/shared';
import { ExceptionLogService } from '../domain/abstractions/exception-log-service';
import { createExceptionLogSchema } from '../controllers/validations/create-exception-log';

@Controller()
export class ExceptionLogMessageHandler {
  constructor(
    private exceptionLogService: ExceptionLogService,
    private logger: Logger
  ) {}

  @EventPattern(EventTopic.EXCEPTION_LOG_ADDED)
  async handleLogAdded(@Payload() message: ExceptionLog) {
    this.logger.debug(`Message received for ${EventTopic.EXCEPTION_LOG_ADDED}`);
    const parsedResponse = createExceptionLogSchema.safeParse(message);

    if (parsedResponse.data) {
      this.logger.debug('Adding exception log', message.exception);
      await this.exceptionLogService.create(parsedResponse.data as ExceptionLog);
    } else {
      this.logger.error(
        `Invalid data format received for ${EventTopic.EXCEPTION_LOG_ADDED}`,
        parsedResponse.error.format()
      );
    }
  }
}
