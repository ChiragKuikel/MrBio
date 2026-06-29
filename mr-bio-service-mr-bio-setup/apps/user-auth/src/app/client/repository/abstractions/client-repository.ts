import { Client } from '../../domain/core/entities/client';
import { BaseRepository, IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';

export abstract class ClientRepository extends BaseRepository<Client, IQuery> {
  abstract findByOrganizationId(
    organizationId: string,
    option?: ServiceOption
  ): Promise<Nullable<Client>>;
}
