import { Role } from '../../domain/core/entities/role';
import { UpdateRoleResourcesDto } from '../../domain/dtos/update-role';
import { UpdateRoleResourcesBody } from '../../controllers/validations';
import { RoleWithModulesResponse } from '../response/role-with-modules-response';

export abstract class RolePresenter {
  abstract updateResourcesBodyToDto(body: UpdateRoleResourcesBody): UpdateRoleResourcesDto;
  abstract roleToRoleWithModulesResponse(role: Role): RoleWithModulesResponse;
}
