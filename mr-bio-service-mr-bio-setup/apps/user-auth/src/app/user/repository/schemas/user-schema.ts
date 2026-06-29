import { BaseSchema } from '@mr-bio/core/external-lib';
import { IDemographic, IPhone, OrganizationReference } from '@mr-bio/core/shared';
import { UserAssociation, UserNetwork, UserStatus } from '../../domain/core/entities/user';

export interface IUser {
  userId: string;
  email: string;
  username: string;
  phones?: IPhone[];
  security?: UserSecurity;
  demographic: IDemographic;
  status: UserStatus;
  association: UserAssociation;
}
export type UserSecurity = {
  password?: string;
  passwordHistory?: string[];
  loginAttempts?: number;
  lastLoginDate?: Date;
  enableMFA?: boolean;
};

export type UserSchema = IUser & BaseSchema;
