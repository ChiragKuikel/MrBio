import { IQuery } from '@mr-bio/core/shared';

export type ResourceQueryOptions = Partial<{
  name: string;
  code: string;
}> &
  IQuery;
