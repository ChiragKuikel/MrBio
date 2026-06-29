import { ProjectModule } from '../enum';
import { BaseEntity } from '../entities';
import { Injectable, Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EntityActivityLogPublisher } from '../abstractions';
import { EntityActivityLogPublisherImpl } from '../../messaging';

@Injectable()
export class EntityActivityLogPublisherFactory {
  constructor() {} // @Inject(KAFKA_CLIENT_NAME) private readonly client: ClientKafka

  create<Entity extends BaseEntity>(
    projectModule: ProjectModule
  ): EntityActivityLogPublisher<Entity> {
    return new EntityActivityLogPublisherImpl<Entity>(projectModule);
  }
}
