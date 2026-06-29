import { IPaginationQuery, IQuery } from '../types';

export function getCommonQueryParams(query: IQuery): IPaginationQuery {
  return {
    ...(query.limit && { limit: query.limit }),
    ...(query.page && { page: query.page }),
    ...(query.sortBy && { sortBy: query.sortBy }),
  };
}
