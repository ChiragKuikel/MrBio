import { Role } from '../core/entities/role';
import { RoleInfo } from '../dtos/role-info';
import { CreateRoleDto } from '../dtos/create-role';
import { RoleQueryOptions } from '../dtos/role-query';
import { Privileges } from '../../../../shared/types/privilege';
import { UpdateRoleDto, UpdateRoleResourcesDto } from '../dtos/update-role';
import { BaseService, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class RoleService extends BaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleQueryOptions
> {
  abstract getRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>>;
  abstract getRoleInfoById(id: string, option?: ServiceOption): Promise<RoleInfo>;
  abstract getOneByCode(code: string, option?: ServiceOption): Promise<Role>;
  abstract updateResourcesById(
    id: string,
    updateDto: UpdateRoleResourcesDto,
    option: ServiceOption
  ): Promise<Role>;

  abstract getRolePrivilegesByCodes(codes: string[], option?: ServiceOption): Promise<Privileges>;
}
