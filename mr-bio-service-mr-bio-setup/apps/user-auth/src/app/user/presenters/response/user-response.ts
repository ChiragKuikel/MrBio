import { UserNetwork } from '../../domain/core/entities/user';
import { Gender, IAddress, IPhone, OrganizationReference } from '@mr-bio/core/shared';

export type UserResponse = {
  id: string;
  username: string;
  email: string;
  phones?: IPhone[];
  firstName: string;
  middleName?: string;
  lastName: string;
  dob?: string;
  gender: Gender;
  address?: IAddress;
  roles: string[];
};
