import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { ActivityLogPublisherImpl } from './activity-log-publisher-impl';
import { EntityActivityLogPublisher } from '../domain/abstractions/entity-activity-log-publisher';
import {
  BaseEntity,
  IQuery,
  ProjectModule,
  ServiceOption,
  buildChangedData,
  buildSearchLogAttributes,
} from '../domain';

export class EntityActivityLogPublisherImpl<Entity extends BaseEntity>
  extends ActivityLogPublisherImpl
  implements EntityActivityLogPublisher<Entity>
{
  constructor(
    // @Inject(KAFKA_CLIENT_NAME) client: ClientKafka,
    private module: ProjectModule
  ) {
    super();
  }

  publishCreateLog(entity: Entity, data: Partial<Entity>, option?: ServiceOption): void {
    this.publishCreateLogEvent(
      {
        module: this.module,
        userVisibility: true,
        attributes: {
          data,
          reference: {
            refId: entity.id,
            projectModule: this.module,
          },
        },
      },
      option?.authEntity
    );
  }

  publishUpdateLog(entity: Entity, updatedEntity: Entity, option?: ServiceOption): void {
    this.publishUpdateLogEvent(
      {
        module: this.module,
        userVisibility: true,
        attributes: {
          data: buildChangedData(entity, updatedEntity, ['updated', 'created']),
          reference: {
            refId: entity.id,
            projectModule: this.module,
          },
        },
      },
      option?.authEntity
    );
  }

  publishSearchLog(query: IQuery, option?: ServiceOption): void {
    const { keyword, advancedFilter } = buildSearchLogAttributes(query);

    if (keyword) {
      this.publishSearchLogEvent(
        {
          module: this.module,
          userVisibility: true,
          attributes: {
            data: {
              keyword,
            },
          },
        },
        option?.authEntity
      );
    }

    if (advancedFilter) {
      this.publishSearchLogEvent(
        {
          module: this.module,
          userVisibility: true,
          attributes: {
            data: advancedFilter,
          },
        },
        option?.authEntity
      );
    }
  }

  publishDeleteLog(id: string, option?: ServiceOption): void {
    this.publishDeleteLogEvent(
      {
        module: this.module,
        userVisibility: true,
        attributes: {
          reference: {
            refId: id,
            projectModule: this.module,
          },
        },
      },
      option?.authEntity
    );
  }
}
