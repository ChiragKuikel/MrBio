import { Filter } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { ActivityLogSchema } from '../schemas/activity-log-schema';
import { ActivityLog } from '../../domain/core/entities/activity-log';
import { ActivityLogQueryOptions } from '../../domain/dtos/activity-log-query';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
import {
  DBQuery,
  EMPTY_PAGINATED_RESPONSE,
  MatchType,
  FindAllResponse,
  RoleCode,
  SYSTEM,
  ServiceOption,
  deleteProperty,
} from '@mr-bio/core/shared';
import {
  BaseModel,
  MongoConnection,
  buildPaginationPipelineStages,
  prepareDbMatchForDateRange,
  prepareSearchCondition,
  prepareSoftDeletionCondition,
} from '@mr-bio/core/external-lib';

@Injectable()
export class ActivityLogModel extends BaseModel<ActivityLogSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.ACTIVITY_LOG, {
      useSoftDelete: true,
      uniqueIdentifierField: 'activityLogId',
      filterableFields: ['logged.id', 'log.module'],
      indexingFields: ['event.type', 'logged.by', 'log.module'],
      searchableFields: [
        'event.type',
        'event.subType',
        'logged.by',
        'log.module',
        'log.subModule',
        'log.attributes.data.keyword' as any,
      ],
    });
  }

  async findAllVisibleLogs(
    query: ActivityLogQueryOptions & DBQuery,
    option?: ServiceOption
  ): Promise<FindAllResponse<ActivityLog>> {
    let moduleMatchCondition: Filter<ActivityLogSchema> = {};
    if (query.module) {
      moduleMatchCondition = {
        $or: [
          prepareSearchCondition('log.module', query.module),
          prepareSearchCondition('log.subModule', query.module),
        ],
      };
      deleteProperty(query, ['module', 'log.module']);
    }

    const dateRangeMatchCondition = prepareDbMatchForDateRange('logged.at', query);

    const defaultMatchCondition = this.buildQuery(
      { ...query, propertyMatchType: MatchType.WHOLE },
      option
    );

    if (!query.sortBy) {
      query.sortBy = 'logged.at:desc';
    }

    const matchConditions: Filter<ActivityLogSchema> = {
      ...defaultMatchCondition,
      ...moduleMatchCondition,
      ...dateRangeMatchCondition,
      userVisibility: true,
    };

    const stagesToFilterOutSuperAdminLogs = [
      {
        $lookup: {
          as: 'user',
          foreignField: 'userId',
          from: 'userAuth_users',
          localField: 'logged.id',
          pipeline: [
            {
              $match: {
                'association.roles': {
                  $ne: RoleCode.SUPER_ADMIN,
                },
                ...prepareSoftDeletionCondition(),
              },
            },
            { $project: { id: '$userId' } },
          ],
        },
      },
      {
        $match: {
          $or: [
            {
              user: {
                $exists: true,
                $not: {
                  $size: 0,
                },
              },
            },
            {
              'logged.id': {
                $exists: false,
              },
            },
            {
              'logged.by': {
                $eq: SYSTEM,
              },
            },
          ],
        },
      },
    ];

    const pipeline = [
      {
        $match: matchConditions,
      },
      ...stagesToFilterOutSuperAdminLogs,
      ...buildPaginationPipelineStages(query, [
        {
          $project: {
            _id: 0,
            log: 1,
            event: 1,
            logged: 1,
            severity: 1,
            id: '$activityLogId',
          },
        },
        {
          $project: {
            log: {
              attributes: {
                data: { dataList: 0 },
              },
            },
          },
        },
      ]),
    ];

    const result = (await this.aggregate(pipeline, option))[0];

    return (result ?? EMPTY_PAGINATED_RESPONSE) as FindAllResponse<ActivityLog>;
  }
}
