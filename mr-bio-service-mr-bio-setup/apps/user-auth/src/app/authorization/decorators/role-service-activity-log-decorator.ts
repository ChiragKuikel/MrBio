import { Injectable } from '@nestjs/common';
import { Role } from '../domain/core/entities/role';
import { RoleInfo } from '../domain/dtos/role-info';
import { CreateRoleDto } from '../domain/dtos/create-role';
import { RoleQueryOptions } from '../domain/dtos/role-query';
import { RoleService } from '../domain/abstractions/role-service';
import { UpdateRoleResourcesDto } from '../domain/dtos/update-role';
import { RoleServiceBaseDecorator } from './role-service-base-decorator';
import {
  EntityActivityLogPublisher,
  EntityActivityLogPublisherFactory,
  FindAllResponse,
  ProjectModule,
  ServiceOption,
} from '@mr-bio/core/shared';

@Injectable()
export class RoleServiceActivityLogDecorator extends RoleServiceBaseDecorator {
  module: ProjectModule = ProjectModule.ROLE;
  activityLogPublisher: EntityActivityLogPublisher<Role>;

  constructor(
    userService: RoleService,
    activityLogPublisherFactory: EntityActivityLogPublisherFactory
  ) {
    super(userService);
    this.activityLogPublisher = activityLogPublisherFactory.create(this.module);
  }

  async create(createDto: CreateRoleDto, option?: ServiceOption): Promise<Role> {
    const role = await super.create(createDto, option);

    this.activityLogPublisher.publishCreateLog(
      role,
      {
        code: role.code,
        name: role.name,
      },
      option
    );

    return role;
  }

  async getRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>> {
    const result = super.get(query, option);

    this.activityLogPublisher.publishSearchLog(query, option);

    return (await result).rows;
  }

  async updateById(
    id: string,
    updateDto: Partial<CreateRoleDto>,
    option?: ServiceOption
  ): Promise<Role> {
    const role = await super.getOneById(id, option);

    const updatedRole = await super.updateById(id, updateDto, option);

    this.activityLogPublisher.publishUpdateLog(role, updatedRole, option);

    return updatedRole;
  }

  async updateResourcesById(
    id: string,
    updateDto: UpdateRoleResourcesDto,
    option: ServiceOption
  ): Promise<Role> {
    const role = await super.getOneById(id, option);

    const updatedRole = await super.updateResourcesById(id, updateDto, option);

    this.activityLogPublisher.publishUpdateLog(role, updatedRole, option);

    return updatedRole;
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    await super.deleteById(id, option);

    this.activityLogPublisher.publishDeleteLog(id, option);
  }
}
