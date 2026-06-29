import TriggerPoint from '../../../shared/enums/trigger-point';
import { BaseRepository, ServiceOption } from '@mr-bio/core/shared';
import { MessageTemplate } from '../../domain/core/entities/message-template';
import { DestructuredMessageTemplate } from '../../domain/dtos/destructured-message-template';

export abstract class MessageTemplateRepository extends BaseRepository<MessageTemplate> {
  abstract findDestructuredByTriggerPoints(
    triggerPoints: TriggerPoint[],
    option?: ServiceOption
  ): Promise<DestructuredMessageTemplate[]>;
}
