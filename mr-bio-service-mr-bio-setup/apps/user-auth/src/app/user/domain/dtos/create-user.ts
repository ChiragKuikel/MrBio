import { Gender, IAddress, IPhone } from '@mr-bio/core/shared';

export type CreateUserDto = {
  lastName: string;
  firstName: string;
  email: string;
  dob?: string;
  phones?: IPhone[];
  gender: Gender;
  middleName?: string;
  address?: IAddress;
  password: string;
  roleCodes: string[];
};
