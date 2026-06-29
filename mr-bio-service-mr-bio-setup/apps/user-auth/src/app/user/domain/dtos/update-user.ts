import { UserNetwork } from '../core/entities/user';
import { Gender, IAddress, IPhone } from '@mr-bio/core/shared';

export type UpdateUserDto = Partial<{
  email: string;
  phones: IPhone[];
  firstName: string;
  middleName: string;
  lastName: string;
  gender: Gender;
  dob: string;
  address: IAddress;
  enableMFA: boolean;
  networks: UserNetwork[];
}>;
