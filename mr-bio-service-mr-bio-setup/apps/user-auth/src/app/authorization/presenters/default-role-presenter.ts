import { Injectable } from '@nestjs/common';
import { Role } from '../domain/core/entities/role';
import { RolePresenter } from './abstractions/role-presenter';
import { UpdateRoleResourcesDto } from '../domain/dtos/update-role';
import { UpdateRoleResourcesBody } from '../controllers/validations';
import { RoleWithModulesResponse } from './response/role-with-modules-response';
import {
  createAssociatedResourcesHierarchy,
  flattenAndFilterAssociatedResources,
} from '../../../shared/utils/associated-resource';

@Injectable()
export class DefaultRolePresenter implements RolePresenter {
  roleToRoleWithModulesResponse(role: Role): RoleWithModulesResponse {
    const modules = createAssociatedResourcesHierarchy(role.resources);

    return {
      modules,
      role: {
        name: role.name,
        code: role.code,
      },
    };
  }

  updateResourcesBodyToDto(body: UpdateRoleResourcesBody): UpdateRoleResourcesDto {
    return { resources: flattenAndFilterAssociatedResources(body.resources) };
  }
}
