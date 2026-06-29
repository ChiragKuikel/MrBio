import { Injectable } from '@nestjs/common';
import { ClientSchema } from '../schemas/client-schema';
import { BaseModel, MongoConnection } from '@mr-bio/core/external-lib';
import { dbCollections } from '../../../../external-lib/mongo-db/db-collections';

@Injectable()
export class ClientModel extends BaseModel<ClientSchema> {
  constructor(mongodbConnection: MongoConnection) {
    super(mongodbConnection, dbCollections.CLIENT, {
      useSoftDelete: true,
      searchableFields: [],
      filterableFields: ['organization.id'],
      uniqueIdentifierField: 'clientId',
      isolateOrganization: true,
    });
  }
}
