import { Role } from '../domain/core/entities/role';
import { RoleInfo } from '../domain/dtos/role-info';
import { CreateRoleDto } from '../domain/dtos/create-role';
import { Privileges } from '../../../shared/types/privilege';
import { RoleQueryOptions } from '../domain/dtos/role-query';
import { RoleService } from '../domain/abstractions/role-service';
import { UpdateRoleResourcesDto } from '../domain/dtos/update-role';
import {
  ServiceOption,
  PaginatedResponse,
  CountResponse,
  FindAllResponse,
} from '@mr-bio/core/shared';

export class RoleServiceBaseDecorator implements RoleService {
  constructor(private roleService: RoleService) {}

  async getRolePrivilegesByCodes(codes: string[], option?: ServiceOption): Promise<Privileges> {
    return await this.roleService.getRolePrivilegesByCodes(codes, option);
  }

  async getRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>> {
    return await this.roleService.getRoleInfos(query, option);
  }

  async getRoleInfoById(id: string, option?: ServiceOption): Promise<RoleInfo> {
    return await this.roleService.getRoleInfoById(id, option);
  }

  async getOneByCode(code: string, option?: ServiceOption): Promise<Role> {
    return await this.roleService.getOneByCode(code, option);
  }

  async updateResourcesById(
    id: string,
    updateDto: UpdateRoleResourcesDto,
    option: ServiceOption
  ): Promise<Role> {
    return await this.roleService.updateResourcesById(id, updateDto, option);
  }

  async create(createDto: CreateRoleDto, option?: ServiceOption): Promise<Role> {
    return await this.roleService.create(createDto, option);
  }

  async count(query: RoleQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.roleService.count(query, option);
  }

  async get(query: RoleQueryOptions, option?: ServiceOption): Promise<PaginatedResponse<Role>> {
    return await this.roleService.get(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Role> {
    return await this.roleService.getOneById(id, option);
  }

  async updateById(
    id: string,
    updateDto: Partial<CreateRoleDto>,
    option?: ServiceOption
  ): Promise<Role> {
    return await this.roleService.updateById(id, updateDto, option);
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    return await this.roleService.deleteById(id, option);
  }
}
