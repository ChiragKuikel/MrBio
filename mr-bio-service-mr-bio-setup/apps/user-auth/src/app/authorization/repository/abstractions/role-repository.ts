import { Role } from '../../domain/core/entities/role';
import { RoleInfo } from '../../domain/dtos/role-info';
import { RoleQueryOptions } from '../../domain/dtos/role-query';
import { BaseRepository, Nullable, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class RoleRepository extends BaseRepository<Role, RoleQueryOptions> {
  abstract findRoleInfos(
    query: RoleQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<RoleInfo>>;
  abstract findRoleInfoById(id: string, option?: ServiceOption): Promise<Nullable<RoleInfo>>;
  abstract findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Role>>;
  abstract countUsersById(id: string, option?: ServiceOption): Promise<number>;
  abstract findAllByCodes(codes: string[], option?: ServiceOption): Promise<FindAllResponse<Role>>;
}
