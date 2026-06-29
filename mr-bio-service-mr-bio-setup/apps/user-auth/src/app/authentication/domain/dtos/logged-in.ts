import { AuthUser } from '@mr-bio/core/shared';

export type LoggedInDto = {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
  remember?: boolean;
};
