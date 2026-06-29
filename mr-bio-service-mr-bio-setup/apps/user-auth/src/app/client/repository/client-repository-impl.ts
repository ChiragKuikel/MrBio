import { Injectable } from '@nestjs/common';
import { ClientModel } from './models/client-model';
import { ClientSchema } from './schemas/client-schema';
import { Client } from '../domain/core/entities/client';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { ClientRepository } from './abstractions/client-repository';
import { IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';
import { ClientPersistenceMapper } from './mappers/client-persistence-mapper';

@Injectable()
export class ClientRepositoryImpl
  extends BaseRepositoryImpl<Client, ClientSchema, IQuery>
  implements ClientRepository
{
  constructor(
    protected model: ClientModel,
    protected mapper: ClientPersistenceMapper
  ) {
    super(model, mapper);
  }

  async findByOrganizationId(
    organizationId: string,
    option?: ServiceOption
  ): Promise<Nullable<Client>> {
    const entity = await this.model.findOne({ 'organization.id': organizationId }, option);
    if (entity) return this.mapper.persistenceToDomain(entity as ClientSchema);

    return null;
  }
}
