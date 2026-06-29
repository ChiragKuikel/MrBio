import { Injectable } from '@nestjs/common';
import { ProductSchema } from '../schemas/product-schema';
import { Product } from '../../domain/core/entities/product';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class ProductPersistenceMapper extends BasePersistenceMapper<Product, ProductSchema> {
  domainToPersistence(domain: Product): ProductSchema {
    return {
      productId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: ProductSchema): Product {
    const domain = new Product(persistence.productId);
    domain.name = persistence.name;
    domain.description = persistence.description;
    domain.categoryId = persistence.categoryId;
    domain.images = persistence.images;
    domain.price = persistence.price;
    domain.discount = persistence.discount;
    domain.finalPrice = persistence.finalPrice;
    domain.stock = persistence.stock;
    domain.brand = persistence.brand;
    domain.tags = persistence.tags;
    domain.metadata = persistence.metadata;
    domain.status = persistence.status;
    domain.rating = persistence.rating;
    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
