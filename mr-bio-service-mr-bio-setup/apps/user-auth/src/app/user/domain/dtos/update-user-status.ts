import { UserStatus } from '../core/entities/user';

export type UpdateUserStatusDto = {
  status: UserStatus.ACTIVE | UserStatus.INACTIVE;
};
