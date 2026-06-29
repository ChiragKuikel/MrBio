import { isEmpty } from './object';
import { AnyObj, IQuery, Maybe } from '../types';

/**
 * Constructs search log attributes from the query parameters.
 * @param query The query parameters.
 * @returns `{ keyword: Maybe<string>, advancedFilter: Maybe<AnyObj> }`
 */
export function buildSearchLogAttributes(query: IQuery): {
  keyword: Maybe<string>;
  advancedFilter: Maybe<AnyObj>;
} {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const { page, limit, sortBy, keyword, propertyMatchType, ...remaining } = query;
  const advancedFilter = !isEmpty(remaining) ? remaining : undefined;

  return { keyword, advancedFilter };
}
