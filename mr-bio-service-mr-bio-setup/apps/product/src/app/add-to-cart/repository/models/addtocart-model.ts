import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '@mr-bio/core/shared';
import { Nullable, ServiceOption } from '@mr-bio/core/shared';
import { AddToCartSchema } from '../schemas/addtocart-schema';
import { FindAllResponse, IQuery } from '@mr-bio/core/shared';
import { AddToCart } from '../../domain/core/entities/addtocart';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class AddToCartModel extends BaseModel<AddToCartSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.ADD_TO_CART, {
      useSoftDelete: true,
      searchableFields: ['productId', 'userId'],
      filterableFields: ['productId', 'userId'],
      uniqueIdentifierField: 'addToCartId',
    });
  }
  async getByUserId(
    userId: string,
    options?: ServiceOption
  ): Promise<FindAllResponse<AddToCartSchema>> {
    const result = await this.find({ userId }, options);

    return result;
  }

  async getByProductId(
    productId: string,
    userId: string,
    options?: ServiceOption
  ): Promise<Nullable<AddToCartSchema>> {
    const result = await this.findOne({ productId, userId }, options);

    return result;
  }
}
