import { IQuery } from '@mr-bio/core/shared';

export type RoleQueryOptions = Partial<{
  name: string;
}> &
  IQuery;
