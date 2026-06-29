import { BaseEntity } from '../entities';
import { IQuery, ServiceOption } from '../types';
import { ActivityLogPublisher } from './activity-log-publisher';

export abstract class EntityActivityLogPublisher<
  Entity extends BaseEntity,
> extends ActivityLogPublisher {
  abstract publishCreateLog(entity: Entity, data: Partial<Entity>, option?: ServiceOption): void;
  abstract publishUpdateLog(entity: Entity, updatedEntity: Entity, option?: ServiceOption): void;
  abstract publishSearchLog(query: IQuery, option?: ServiceOption): void;
  abstract publishDeleteLog(id: string, option?: ServiceOption): void;
}
