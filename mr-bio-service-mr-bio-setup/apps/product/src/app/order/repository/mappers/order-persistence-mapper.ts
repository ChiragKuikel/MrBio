import { Injectable } from '@nestjs/common';
import { OrderSchema } from '../schemas/order-schema';
import { Order } from '../../domain/core/entities/order';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class OrderPersistenceMapper extends BasePersistenceMapper<Order, OrderSchema> {
  domainToPersistence(domain: Order): OrderSchema {
    return {
      orderId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: OrderSchema): Order {
    const domain = new Order(persistence.orderId);
    domain.contact = persistence.contact;
    domain.userId = persistence.userId;
    domain.orderItems = persistence.orderItems;
    domain.totalAmount = persistence.totalAmount;
    domain.status = persistence.status;
    domain.payment = persistence.payment;
    domain.shippingAddress = persistence.shippingAddress;
    domain.shippingCost = persistence.shippingCost;
    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
