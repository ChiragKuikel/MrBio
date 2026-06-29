import { IQuery } from '@mr-bio/core/shared';

export type ActivityLogQueryOptions = {
  module?: string;
  startDate?: Date;
  endDate?: Date;
  userId?: string;
} & IQuery;
