import { Controller } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { ActivityLog, EventTopic, Logger } from '@mr-bio/core/shared';
import { ActivityLogService } from '../domain/abstractions/activity-log-service';
import { createActivityLogSchema } from '../controllers/validations/create-activity-log';

@Controller()
export class ActivityLogMessageHandler {
  constructor(
    private activityLogService: ActivityLogService,
    private logger: Logger
  ) {}

  @EventPattern(EventTopic.LOG_ADDED)
  async handleLogAdded(@Payload() message: ActivityLog) {
    this.logger.debug(`Message received for ${EventTopic.LOG_ADDED}`);
    const parsedResponse = createActivityLogSchema.safeParse(message);

    if (parsedResponse.data) {
      this.logger.debug('Adding activity log for', message.event);
      await this.activityLogService.create(parsedResponse.data as ActivityLog);
    } else {
      this.logger.error(
        `Invalid data format received for ${EventTopic.LOG_ADDED}`,
        parsedResponse.error.format()
      );
    }
  }
}
