/**
 * get redis key for the identifier
 * @param identifier uniquely identifiable data - id or code
 * @returns prefix concatenated by id [prefix + identifier]
 */
export function getCacheKey(prefix: string, identifier: string): string {
  return `${prefix}:${identifier}`;
}
