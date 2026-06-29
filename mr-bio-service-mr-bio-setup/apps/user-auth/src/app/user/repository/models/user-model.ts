import { Injectable } from '@nestjs/common';
import { UserSchema } from '../schemas/user-schema';
import { Nullable, ServiceOption } from '@mr-bio/core/shared';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';
import { UserAssociationDetail } from '../../domain/dtos/user-association-detail';
import {
  BaseModel,
  MongoConnection,
  conditionToExcludeSoftDeleted,
} from '@mr-bio/core/external-lib';

@Injectable()
export class UserModel extends BaseModel<UserSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.USER, {
      useSoftDelete: true,
      isolateOrganization: true,
      uniqueIdentifierField: 'userId',

      searchableFields: [
        'demographic.name.firstName',
        'demographic.name.lastName',
        'demographic.name.middleName',
        'email',
      ],
      filterableFields: [
        'email',
        'association.roles',
        'status',
        'demographic.name.firstName',
        'demographic.name.lastName',
        'phones',
        'networks.id' as any,
      ],
    });
  }

  async findUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<Nullable<UserAssociationDetail>> {
    const pipeline = [
      {
        $match: {
          userId: id,
          ...conditionToExcludeSoftDeleted,
        },
      },
      {
        $lookup: {
          as: 'roles',
          foreignField: 'code',
          from: dbCollections.ROLE,
          localField: 'association.roles',
          pipeline: [
            {
              $match: {
                ...conditionToExcludeSoftDeleted,
              },
            },
            {
              $project: {
                _id: 0,
                name: 1,
                code: 1,
                resources: 1,
                id: '$roleId',
              },
            },
          ],
        },
      },
      {
        $project: {
          _id: 0,
          roles: 1,
          resources: '$association.resources',
        },
      },
    ];

    const result = await this.model!.aggregate(pipeline, option).toArray();

    return (result[0] ?? null) as Nullable<UserAssociationDetail>;
  }
}
