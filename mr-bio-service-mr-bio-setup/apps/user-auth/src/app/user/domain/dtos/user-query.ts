import { IQuery } from '@mr-bio/core/shared';
import { UserStatus } from '../core/entities/user';

export type UserQueryOptions = ActiveUserQueryOptions & {
  status?: UserStatus;
};

export type ActiveUserQueryOptions = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  role?: string;
} & IQuery;
