/* eslint-disable perfectionist/sort-objects */
export default {
  ACCOUNT_NOT_ACTIVATED:
    'Your account has not been activated. Please contact admin for assistance.',
  ACCOUNT_ALREADY_ACTIVATED: 'User has already been activated',
  USER_ALREADY_EXISTS: 'The email has already been used.',
  SESSION_EXPIRED: 'Session has expired. Please login again.',
  LINK_EXPIRED: 'The link has expired.',
  OTP_EXPIRED: 'The OTP has expired.',
  TOKEN_INVALID: 'The token is invalid.',
  OTP_INVALID: 'The OTP code is invalid.',
  MFA_NOT_ENABLED: 'MFA has not been enabled.',
  PASSWORD_NOT_SET: 'Password has not been set.',
  PASSWORD_NOT_MATCHED: 'Current password does not match.',
  PASSWORD_HISTORY_ERROR: 'You cannot use your current password as the new password.',

  RESOURCE_ALREADY_EXISTS: 'Resource already exists.',
  RESOURCE_INTEGRIY_INVALID:
    'One or more resources either do not exist or have an improper hierarchy.',
  PERMISSION_ASSIGNED_TO_PARENT:
    'Permission cannot be assigned to a parent module that includes sub modules',
  RESOURCE_ASSIGNED_TO_ROLE: 'The resource has been assigned to a role',
  AMBIGUOUS_ROLE_PERMISSIONS: 'Ambiguous role permissions!',
  ADMIN_MANAGE_PERMISSIONS_REQUIRED:
    'Admins should have permission to manage permissions for roles and users',
  ADMIN_ONLY_MANAGE_PERMISSIONS: 'Only admins can manage permissions for roles and users',
  MANAGE_ROLE_PERMISSIONS_NOT_ALLOWED_USER:
    'Cannot assign permission to manage permissions for roles to user',

  ROLE_DELETION_DENIED_DUE_TO_ASSOCIATED_USERS:
    'Unable to delete the role because it is currently assigned to {{associatedUserCount}} user(s)',

  USER_NOT_FOUND: 'User not found.',
  NETWORK_NOT_ASSIGNED_USER: 'The network is not assigned to the user.',

  ROLE_REQUIRED: 'Please specify a role',
  INVALID_CLIENT_SECRET: 'Invalid client secret',
};
