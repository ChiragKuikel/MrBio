import { Injectable } from '@nestjs/common';
import { OrderSchema } from '../schemas/order-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class OrderModel extends BaseModel<OrderSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.ORDER, {
      useSoftDelete: true,
      searchableFields: [
        'contact.name',
        'contact.email',
        'contact.phone',
        'contact.address',
        'userId',
        'orderItems[].product.id',
        'orderItems[].product.name',
        'orderItems[].product.price',
        'orderItems[].quantity',
        'status',
        // 'payment.method',
        'payment.status',
        'shippingAddress',
      ],
      filterableFields: [
        'status',
        'payment.status',
        'contact.name',
        'contact.email',
        'contact.phone',
        'contact.address',
        'userId',
        'shippingAddress',
      ],
      uniqueIdentifierField: 'orderId',
    });
  }
}
