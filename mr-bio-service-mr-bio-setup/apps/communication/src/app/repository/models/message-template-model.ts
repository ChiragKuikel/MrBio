import { Injectable } from '@nestjs/common';
import TriggerPoint from '../../../shared/enums/trigger-point';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { SOFT_DELETION_FIELD, ServiceOption } from '@mr-bio/core/shared';
import { MessageTemplateSchema } from '../schemas/message-template-schema';
import { dbCollections } from '../../../external-lib/mongo-db/db-collections';
import { DestructuredMessageTemplate } from '../../domain/dtos/destructured-message-template';

@Injectable()
export class MessageTemplateModel extends BaseModel<MessageTemplateSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.MESSAGE_TEMPLATE, {
      useSoftDelete: true,
      searchableFields: ['name', 'description'],
      uniqueIdentifierField: 'messageTemplateId',
      filterableFields: ['code', 'triggerPoints'],
    });
  }

  async findDestructuredByTriggerPoints(
    triggerPoints: TriggerPoint[],
    option?: ServiceOption
  ): Promise<DestructuredMessageTemplate[]> {
    super.validateModel();

    const query = this.model!.aggregate(
      [
        {
          $match: {
            $and: [
              {
                triggerPoints: { $in: triggerPoints },
                [SOFT_DELETION_FIELD]: {
                  $exists: false,
                },
              },
            ],
          },
        },
        {
          $unwind: '$messages',
        },
        {
          $project: {
            _id: 0,
            code: 1,
            name: 1,
            type: 1,
            created: 1,
            description: 1,
            triggerPoints: 1,
            message: '$messages',
            id: '$messageTemplateId',
          },
        },
      ],
      option
    );

    return (await query.toArray()) as DestructuredMessageTemplate[];
  }
}
