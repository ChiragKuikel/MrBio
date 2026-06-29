import { Injectable } from '@nestjs/common';
import { RoleSchema } from '../schemas/role-schema';
import { Role } from '../../domain/core/entities/role';
import { RoleInfo } from '../../domain/dtos/role-info';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class RolePersistenceMapper extends BasePersistenceMapper<Role, RoleSchema> {
  domainToPersistence(domain: Role): RoleSchema {
    return {
      roleId: domain.id,
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: RoleSchema): Role {
    const domain = new Role(persistence.roleId);
    domain.code = persistence.code;
    domain.name = persistence.name;
    domain.resources = persistence.resources;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }

  persistenceToRoleInfo(persistence: RoleSchema): RoleInfo {
    return {
      code: persistence.code,
      name: persistence.name,
    };
  }
}
