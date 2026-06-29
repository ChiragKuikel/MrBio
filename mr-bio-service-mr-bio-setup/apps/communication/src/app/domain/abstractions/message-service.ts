import { ServiceOption } from '@mr-bio/core/shared';
import { SendMessageDto } from '../dtos/send-message';
import TriggerPoint from '../../../shared/enums/trigger-point';

export abstract class MessageService {
  abstract sendMessagesByTriggerPoints(
    triggerPoints: TriggerPoint[],
    sendMessageDto: SendMessageDto,
    option?: ServiceOption
  ): Promise<void>;
}
