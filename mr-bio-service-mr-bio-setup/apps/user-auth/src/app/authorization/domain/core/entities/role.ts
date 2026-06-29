import { errorMessage } from '../../../../../shared/constants';
import { AssociatedResource } from '../../../../../shared/types/associated-resource';
import { validateAssociatedResource } from '../../../../../shared/utils/associated-resource';
import { BadRequestException, BaseEntity, RoleCode, toKebabCase } from '@mr-bio/core/shared';
import {
  hasGrantedPermissionToManagePermissions,
  hasPermissionToManagePermissions,
} from '../../../../../shared/utils/permission';

export class Role extends BaseEntity {
  code: string;
  name: string;
  resources: AssociatedResource[];

  initialize(builder: { name: string }) {
    this.name = builder.name;
    this.code = toKebabCase(this.name, true);
    this.resources = [];
  }

  get canManagePermissions(): boolean {
    return [RoleCode.ORGANIZATION_ADMIN, RoleCode.SUPER_ADMIN].includes(this.code as RoleCode);
  }

  setResources(resources: AssociatedResource[]) {
    // validate resources
    resources.forEach(resource => {
      if (!validateAssociatedResource(resource)) {
        throw new BadRequestException(errorMessage.AMBIGUOUS_ROLE_PERMISSIONS);
      }
    });

    // Admins must have permissions to manage permissions of roles and users but other roles should not
    if (this.canManagePermissions) {
      if (!hasGrantedPermissionToManagePermissions(resources)) {
        throw new BadRequestException(errorMessage.ADMIN_MANAGE_PERMISSIONS_REQUIRED);
      }
    } else {
      if (hasPermissionToManagePermissions(resources)) {
        throw new BadRequestException(errorMessage.ADMIN_ONLY_MANAGE_PERMISSIONS);
      }
    }

    this.resources = resources;
  }
}
