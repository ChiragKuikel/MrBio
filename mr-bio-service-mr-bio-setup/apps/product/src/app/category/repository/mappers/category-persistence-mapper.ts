import { Injectable } from '@nestjs/common';
import { Status } from '../../../../shared/enum/common';
import { CategorySchema } from '../schemas/category-schema';
import { Category } from '../../domain/core/entities/category';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class CategoryPersistenceMapper extends BasePersistenceMapper<Category, CategorySchema> {
  domainToPersistence(domain: Category): CategorySchema {
    return {
      categoryId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: CategorySchema): Category {
    const domain = new Category(persistence.categoryId);
    domain.name = persistence.name;
    domain.code = persistence.code;
    domain.status = persistence.status as Status;
    domain.description = persistence.description;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
