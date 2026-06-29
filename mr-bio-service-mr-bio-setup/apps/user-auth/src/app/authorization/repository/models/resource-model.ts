import { Injectable } from '@nestjs/common';
import { ResourceSchema } from '../schemas/resource-schema';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
import { AssociatedResource } from '../../../../shared/types/associated-resource';
import { ResourceWithSubModules } from '../../domain/dtos/resource-with-sub-modules';
import {
  DBQuery,
  EMPTY_PAGINATED_RESPONSE,
  FindAllResponse,
  SOFT_DELETION_FIELD,
  ServiceOption,
} from '@mr-bio/core/shared';
import {
  BaseModel,
  MongoConnection,
  buildPaginationPipelineStages,
  conditionToExcludeSoftDeleted,
} from '@mr-bio/core/external-lib';

@Injectable()
export class ResourceModel extends BaseModel<ResourceSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.RESOURCE, {
      useSoftDelete: true,
      filterableFields: ['name', 'code'],
      uniqueIdentifierField: 'resourceId',
    });
  }

  async findAllTopLevelParentResources(
    query: DBQuery<ResourceSchema>,
    option?: ServiceOption
  ): Promise<FindAllResponse<ResourceWithSubModules>> {
    const conditions = this.buildQuery(query, option);

    const pipeline = [
      {
        $graphLookup: {
          as: 'subModules',
          startWith: '$code',
          connectFromField: 'code',
          connectToField: 'parent',
          from: dbCollections.RESOURCE,
          restrictSearchWithMatch: {
            [SOFT_DELETION_FIELD]: { $exists: false },
          },
        },
      },
      {
        $match: {
          ...conditions,
          $or: [{ parent: { $exists: false } }, { parent: { $eq: null } }],
        },
      },
      ...buildPaginationPipelineStages(query, [
        {
          $project: {
            _id: 0,
            code: 1,
            name: 1,
            order: 1,
            parent: 1,
            routePath: 1,
            description: 1,
            permissions: 1,
            id: '$resourceId',
            subModules: {
              $map: {
                as: 'subModule',
                input: '$subModules',
                in: {
                  code: '$$subModule.code',
                  name: '$$subModule.name',
                  order: '$$subModule.order',
                  id: '$$subModule.resourceId',
                  parent: '$$subModule.parent',
                  routePath: '$$subModule.routePath',
                  description: '$$subModule.description',
                  permissions: '$$subModule.permissions',
                },
              },
            },
          },
        },
      ]),
    ];

    const response = await this.aggregate(pipeline, option);

    return (response[0] ?? EMPTY_PAGINATED_RESPONSE) as FindAllResponse<ResourceWithSubModules>;
  }

  async countRolesById(id: string, option?: ServiceOption): Promise<number> {
    const result = await this.aggregate(
      [
        {
          $match: {
            resourceId: id,
            [SOFT_DELETION_FIELD]: { $exists: false },
          },
        },
        {
          $lookup: {
            as: 'roles',
            localField: 'code',
            from: dbCollections.ROLE,
            foreignField: 'resources.code',
          },
        },
        {
          $unwind: {
            path: '$roles',
          },
        },
        { $count: 'count' },
      ],
      option
    );

    return result[0]?.count ?? 0;
  }

  async findSuperAdminResources(option?: ServiceOption): Promise<AssociatedResource[]> {
    const pipeline = [
      {
        $match: {
          ...conditionToExcludeSoftDeleted,
        },
      },
      {
        $project: {
          _id: 0,
          code: 1,
          parent: 1,
          isGranted: { $literal: true },
          permissions: {
            code: 1,
            isGranted: { $literal: true },
          },
        },
      },
    ];

    return (await this.aggregate(pipeline, option)) as AssociatedResource[];
  }
}
