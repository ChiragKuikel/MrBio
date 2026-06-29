import { UserStatus } from '../core/entities/user';
import { UserPrivileges } from './user-privileges';
import { Gender, IAddress } from '@mr-bio/core/shared';

export type UserWithGrantedPrivileges = {
  id: string;
  // organizationId: string;
  // organizationName: string;
  // networkIds?: string[];
  username: string;
  email: string;
  phone?: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  dob?: string;
  gender: Gender;
  loginAttempts?: number;
  lastLoginDate?: Date;
  enableMFA: boolean;
  status: UserStatus;
  address?: IAddress;
  grantedPrivileges: UserPrivileges;
};
