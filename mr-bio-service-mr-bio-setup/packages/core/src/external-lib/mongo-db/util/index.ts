import { FindOptions } from 'mongodb';
import { ICreateOptions } from '../types';
import { MongoDistnaceUnits } from '../../enum';
import { DateUnit } from '../../../shared/domain/enum/date';
import { IQuery } from '../../../shared/domain/types/query';
import { SOFT_DELETION_FIELD } from '../../../shared/domain/constants';
import { AnyObj, DeepPartial } from '../../../shared/domain/types/object';
import { IPaginationQuery } from '../../../shared/domain/types/pagination';
import { addDate, resetTimeToMidnight } from '../../../shared/domain/utils/date';
import { parseSpecialCharacterString } from '../../../shared/domain/utils/string';
import { BadRequestException, resolveAdminAssigner, resolveAssigner } from '../../../shared';

export function parsePagination(page?: string | number, limit?: string | number) {
  if (isNaN(Number(page ?? 1))) throw new BadRequestException('Page must be in number');
  else page = Number(page ?? 1);
  if (isNaN(Number(limit ?? 10))) throw new BadRequestException('Page size must be in number');
  else limit = Number(limit ?? 10);

  return { page, limit };
}

export function resolvePaginationOptions(options: IPaginationQuery) {
  const { page, limit } = parsePagination(options.page, options.limit);
  const skip = (page - 1) * limit;

  return { skip, limit, order: validateSortBy(options.sortBy) };
}

export function resolvePaginationOptionsWithMetadata(total: number, options: IPaginationQuery) {
  const { page, limit } = parsePagination(options.page, options.limit);

  const totalPage = Math.ceil(total / limit),
    hasNextPage = totalPage - page > 0,
    hasPreviousPage = page - 1 > 0;

  const skip = (page - 1) * limit;

  return {
    metaInfo: { totalPage, hasNextPage, hasPreviousPage, currentPage: page },
    paginationQuery: {
      skip,
      limit,
      order: validateSortBy(options.sortBy),
    },
  };
}

/**
 * The function resolves find options based on a query object and returns the updated options object.
 * @param {IQuery} query - The `query` parameter is of type `IQuery`, which is an interface
 * representing a query object. It likely contains properties such as `fields` and `excludeFields`.
 * @param {FindOptions} options - The `options` parameter is an object that contains additional options
 * for the `find` operation. It is optional and has a default value of an empty object `{}`.
 * @returns the `options` object.
 */
export function resolveFindOptions(query: IQuery, options: FindOptions = {}) {
  if (query.fields || query.excludeFields) {
    const projection: AnyObj = {};

    const projectionType = query.fields ? 1 : 0;
    const projectionKey = projectionType ? 'fields' : 'excludeFields';

    query[projectionKey]
      ?.split(',')
      .forEach((k: string) => (projection[k.trim()] = projectionType));
    options.projection = projection;
  }

  return options;
}

/**
 * The function resolves the body of an entity by assigning values to certain fields and generating a
 * unique identifier if specified.
 * @param {any} body - The `body` parameter is of type `any` and represents the data that needs to be
 * resolved.
 * @param {any} uniqueIdentifierField - The uniqueIdentifierField is a field in the body object that
 * will be assigned a random unique identifier using the crypto.randomUUID() function.
 * @param {boolean} isBaseEntity - A boolean value indicating whether the entity is a base entity or
 * not. If it is a base entity, the function will resolve the "updated" and "created" fields using the
 * assigner function. If it is not a base entity, only the "created" field will be resolved using the
 * resolve
 * @param {ICreateOptions} [options] - The `options` parameter is an optional object that can be passed
 * to the `resolveBody` function. It is of type `ICreateOptions`, which is not defined in the code
 * snippet provided. The purpose and structure of the `ICreateOptions` type would need to be known in
 * order to
 * @returns an object that contains the resolved body, the original body, and a unique identifier field
 * if provided.
 */
export function resolveBody(body: any, isBaseEntity: boolean, options?: ICreateOptions) {
  let resolvedBody = {};
  if (isBaseEntity) {
    const assigner = resolveAssigner(options);
    resolvedBody = { updated: assigner, created: assigner };
  } else {
    resolvedBody = { created: resolveAdminAssigner(options) };
  }

  return {
    ...body,
    ...resolvedBody,
  };
}

export function prepareDbMatchForDateRange(
  dateField: string,
  dateRange?: { startDate?: Date; endDate?: Date }
) {
  if (dateField && dateRange && (dateRange.startDate || dateRange.endDate)) {
    return {
      [dateField]: {
        ...(dateRange.startDate
          ? {
              $gte: new Date(resetTimeToMidnight(dateRange.startDate)).toISOString(),
            }
          : {}),
        ...(dateRange.endDate
          ? {
              $lt: new Date(
                resetTimeToMidnight(addDate(new Date(dateRange.endDate), 1, DateUnit.DAYS))
              ).toISOString(),
            }
          : {}),
      },
    };
  }

  return null;
}

export function prepareSoftDeletionCondition(deletionField: string = SOFT_DELETION_FIELD) {
  return {
    $or: [{ [deletionField]: { $exists: false } }, { [deletionField]: { $eq: null } }],
  };
}

export const buildEncryptedSchema = <T>(schema: DeepPartial<T>) => schema;

export const prepareSearchCondition = (filterField: string, fieldValue: any) => {
  return { [filterField]: { $options: 'i', $regex: parseSpecialCharacterString(fieldValue) } };
};

/**
 * Validates and parses a sortBy string into a sorting object.
 * @param sortBy The sortBy string to validate and parse.
 * @returns The sorting object.
 */
export function validateSortBy(sortBy: string = 'created.at') {
  const validSortInput = /^([\w\d_\\.]+(:asc|:desc)?)(,[\w\d_\\.]+(:asc|:desc)?)*$/;

  if (!validSortInput.test(sortBy.toLocaleLowerCase())) throw new Error('Invalid sortBy format!');

  const sorting: Record<string, -1 | 1> = {};

  const pairs = sortBy.split(',');
  pairs.forEach(pair => {
    const [fieldName, sortType] = pair.split(':');
    sorting[fieldName!] = sortType ? (sortType.toLocaleLowerCase() === 'asc' ? 1 : -1) : -1;
  });

  return sorting;
}

/**
 * get a stage that calculates the distance
 * @param fieldName name of the distance field
 * @param coordinatesField the longitude field in the document - exclude $ symbol
 * @param coordinates longitude and latitude of the center point [longitude, latitude]
 * @param units MongoDistnaceUnits Distance fields accepted by mongo- []
 * @returns an addFields staee that calculates distance using the provided inputs
 */
export function getStageForAddingDistanceField(
  fieldName: string,
  coordinatesField: string,
  coordinates: number[],
  units: MongoDistnaceUnits = MongoDistnaceUnits.Miles
) {
  return {
    $addFields: {
      [fieldName]: {
        $let: {
          vars: {
            lat1: {
              $multiply: [
                { $arrayElemAt: [`$${coordinatesField}`, 1] },
                { $divide: [3.141592653589793, 180] },
              ],
            },
            lon1: {
              $multiply: [
                { $arrayElemAt: [`$${coordinatesField}`, 0] },
                { $divide: [3.141592653589793, 180] },
              ],
            },
            lat2: { $multiply: [coordinates[1], { $divide: [3.141592653589793, 180] }] },
            lon2: { $multiply: [coordinates[0], { $divide: [3.141592653589793, 180] }] },
          },
          in: {
            $multiply: [
              getEarthRadius(units),
              {
                $multiply: [
                  2,
                  {
                    $atan2: [
                      {
                        $sqrt: {
                          $add: [
                            {
                              $pow: [
                                {
                                  $sin: {
                                    $divide: [{ $subtract: ['$$lat2', '$$lat1'] }, 2],
                                  },
                                },
                                2,
                              ],
                            },
                            {
                              $multiply: [
                                { $cos: '$$lat1' },
                                { $cos: '$$lat2' },
                                {
                                  $pow: [
                                    {
                                      $sin: {
                                        $divide: [{ $subtract: ['$$lon2', '$$lon1'] }, 2],
                                      },
                                    },
                                    2,
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      },
                      {
                        $sqrt: {
                          $subtract: [
                            1,
                            {
                              $add: [
                                {
                                  $pow: [
                                    {
                                      $sin: {
                                        $divide: [{ $subtract: ['$$lat2', '$$lat1'] }, 2],
                                      },
                                    },
                                    2,
                                  ],
                                },
                                {
                                  $multiply: [
                                    { $cos: '$$lat1' },
                                    { $cos: '$$lat2' },
                                    {
                                      $pow: [
                                        {
                                          $sin: {
                                            $divide: [{ $subtract: ['$$lon2', '$$lon1'] }, 2],
                                          },
                                        },
                                        2,
                                      ],
                                    },
                                  ],
                                },
                              ],
                            },
                          ],
                        },
                      },
                    ],
                  },
                ],
              },
            ],
          },
        },
      },
    },
  };
}
const getEarthRadius = (units: MongoDistnaceUnits): number => {
  switch (units) {
    case MongoDistnaceUnits.Kilometers:
      return 6371;
    case MongoDistnaceUnits.Meters:
      return 6371000;
    case MongoDistnaceUnits.Feet:
      return 20903505;
    default:
      return 3958.8;
  }
};
