import { Injectable } from '@nestjs/common';
import { ResourceSchema } from '../schemas/resource-schema';
import { Resource } from '../../domain/core/entities/resource';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class ResourcePersistenceMapper extends BasePersistenceMapper<Resource, ResourceSchema> {
  domainToPersistence(domain: Resource): ResourceSchema {
    return {
      resourceId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: ResourceSchema): Resource {
    const domain = new Resource(persistence.resourceId);
    domain.code = persistence.code;
    domain.name = persistence.name;
    domain.description = persistence.description;
    domain.icon = persistence.icon;
    domain.order = persistence.order;
    domain.parent = persistence.parent;
    domain.permissions = persistence.permissions;
    domain.routePath = persistence.routePath;
    domain.isMenu = persistence.isMenu;

    return domain;
  }
}
