import { ResourceCode } from '../enum';

export const resourcePermissions = {
  [ResourceCode.USER_MANAGEMENT]: {
    manage: 'USER-MANAGEMENT-MANAGE-PERMISSION',
  },
  [ResourceCode.ROLES_PERMISSIONS_MANAGEMENT]: {
    manage: 'ROLES-PERMISSION-MANAGEMENT-MANAGE-PERMISSION',
  },
};
