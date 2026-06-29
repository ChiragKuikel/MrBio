import { Order } from '../core/entities/order';
import { CreateOrderDto } from '../dtos/create-order';
import { UpdateOrderDto } from '../dtos/update-order';
import { BaseService, IQuery } from '@mr-bio/core/shared';

export abstract class OrderService extends BaseService<
  Order,
  CreateOrderDto,
  UpdateOrderDto,
  IQuery
> {}
