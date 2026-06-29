import { Injectable } from '@nestjs/common';
import { ServiceOption } from '@mr-bio/core/shared';
import TriggerPoint from '../../shared/enums/trigger-point';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { MessageTemplateModel } from './models/message-template-model';
import { MessageTemplateSchema } from './schemas/message-template-schema';
import { MessageTemplate } from '../domain/core/entities/message-template';
import { MessageTemplateRepository } from './abstractions/message-template-repository';
import { DestructuredMessageTemplate } from '../domain/dtos/destructured-message-template';
import { MessageTemplatePersistenceMapper } from './mappers/message-template-persistence-mapper';

@Injectable()
export class MessageTemplateRepositoryImpl
  extends BaseRepositoryImpl<MessageTemplate, MessageTemplateSchema>
  implements MessageTemplateRepository
{
  constructor(
    protected model: MessageTemplateModel,
    protected mapper: MessageTemplatePersistenceMapper
  ) {
    super(model, mapper);
  }

  async findDestructuredByTriggerPoints(
    triggerPoints: TriggerPoint[],
    option?: ServiceOption
  ): Promise<DestructuredMessageTemplate[]> {
    return await this.model.findDestructuredByTriggerPoints(triggerPoints, option);
  }
}
