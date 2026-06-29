import { Order } from '../../domain/core/entities/order';
import { BaseRepository, IQuery } from '@mr-bio/core/shared';

export abstract class OrderRepository extends BaseRepository<Order, IQuery> {}
