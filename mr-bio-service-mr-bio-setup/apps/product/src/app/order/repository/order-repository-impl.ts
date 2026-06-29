import { Injectable } from '@nestjs/common';
import { IQuery } from '@mr-bio/core/shared';
import { OrderModel } from './models/order-model';
import { OrderSchema } from './schemas/order-schema';
import { Order } from '../domain/core/entities/order';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { OrderRepository } from './abstractions/order-repository';
import { OrderPersistenceMapper } from './mappers/order-persistence-mapper';

@Injectable()
export class OrderRepositoryImpl
  extends BaseRepositoryImpl<Order, OrderSchema, IQuery>
  implements OrderRepository
{
  constructor(
    protected model: OrderModel,
    protected mapper: OrderPersistenceMapper
  ) {
    super(model, mapper);
  }
}
