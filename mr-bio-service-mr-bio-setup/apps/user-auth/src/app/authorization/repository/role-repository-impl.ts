import { Injectable } from '@nestjs/common';
import { RoleModel } from './models/role-model';
import { RoleSchema } from './schemas/role-schema';
import { Role } from '../domain/core/entities/role';
import { RoleInfo } from '../domain/dtos/role-info';
import { RoleQueryOptions } from '../domain/dtos/role-query';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { RoleRepository } from './abstractions/role-repository';
import { RolePersistenceMapper } from './mappers/role-persistence-mapper';
import { ServiceOption, Nullable, FindAllResponse, DBQuery } from '@mr-bio/core/shared';

@Injectable()
export class RoleRepositoryImpl
  extends BaseRepositoryImpl<Role, RoleSchema, RoleQueryOptions>
  implements RoleRepository
{
  constructor(
    protected model: RoleModel,
    protected mapper: RolePersistenceMapper
  ) {
    super(model, mapper);
  }

  async findAllByCodes(codes: string[], option?: ServiceOption): Promise<FindAllResponse<Role>> {
    const rows = await this.model.findAllByCodes(codes, option);

    return rows.map(r => this.mapper.persistenceToDomain(r));
  }

  async findRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>> {
    const rows = await this.model.find(this.mapper.mapQuery(query), {
      ...option,
      projection: {
        code: 1,
        name: 1,
        roleId: 1,
      },
    });

    return rows.map(r => this.mapper.persistenceToRoleInfo(r));
  }

  async findRoleInfoById(id: string, option?: ServiceOption): Promise<Nullable<RoleInfo>> {
    const entity = await this.model.findOne({ roleId: id } as DBQuery<RoleSchema>, {
      ...option,
      projection: { code: 1, name: 1, roleId: 1 },
    });
    if (entity) return this.mapper.persistenceToRoleInfo(entity as RoleSchema);

    return null;
  }

  async countUsersById(id: string, option?: ServiceOption): Promise<number> {
    return await this.model.countUsersByRole(id, option);
  }

  async findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Role>> {
    const entity = await this.model.findOne({ code }, option);
    if (entity) return this.mapper.persistenceToDomain(entity as RoleSchema);

    return null;
  }
}
