import { Injectable } from '@nestjs/common';
import { AddToCartSchema } from '../schemas/addtocart-schema';
import { AddToCart } from '../../domain/core/entities/addtocart';
import { Product } from '../../../product/domain/core/entities/product';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class AddToCartPersistenceMapper extends BasePersistenceMapper<AddToCart, AddToCartSchema> {
  domainToPersistence(domain: AddToCart): AddToCartSchema {
    return {
      addToCartId: domain.id,
      ...withoutAttrs(domain, ['id']),
    } as AddToCartSchema;
  }

  persistenceToDomain(persistence: AddToCartSchema): AddToCart {
    const domain = new AddToCart(persistence.addToCartId);
    domain.created = persistence.created;
    domain.updated = persistence.updated;
    domain.productId = persistence.productId;
    domain.userId = persistence.userId;
    domain.quantity = persistence.quantity;
    domain.product = persistence.product as unknown as Product;

    return domain;
  }
}
