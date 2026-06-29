import { Injectable } from '@nestjs/common';
import { RoleSchema } from '../schemas/role-schema';
import { AnyObj, MatchType, ServiceOption } from '@mr-bio/core/shared';
import { dbCollections } from '../../../..//external-lib/mongo-db/db-collections';
import {
  BaseModel,
  MongoConnection,
  conditionToExcludeSoftDeleted,
} from '@mr-bio/core/external-lib';

@Injectable()
export class RoleModel extends BaseModel<RoleSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.ROLE, {
      useSoftDelete: true,
      uniqueIdentifierField: 'roleId',
      filterableFields: ['name', 'code'],
    });
  }

  async countUsersByRole(id: string, option?: ServiceOption): Promise<number> {
    const pipeline = [
      {
        $match: {
          roleId: id,
          ...conditionToExcludeSoftDeleted,
        },
      },
      {
        $lookup: {
          as: 'user',
          localField: 'code',
          from: dbCollections.USER,
          foreignField: 'association.roles',
          pipeline: [
            {
              $match: {
                ...conditionToExcludeSoftDeleted,
              },
            },
          ],
        },
      },
      {
        $unwind: '$user',
      },
      {
        $count: 'count',
      },
    ];
    const result = await this.model!.aggregate(pipeline, option).toArray();

    return result[0]?.count ?? { count: 0 };
  }

  async findAllByCodes(codes: string[], option?: ServiceOption): Promise<RoleSchema[]> {
    const conditions = super.buildQuery(
      { code: { $in: codes }, propertyMatchType: MatchType.WHOLE } as AnyObj,
      option
    );

    return (await this.model!.find(conditions, option).toArray()) as RoleSchema[];
  }
}
