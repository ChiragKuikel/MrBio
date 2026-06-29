import { Injectable } from '@nestjs/common';
import { ClientSchema } from '../schemas/client-schema';
import { Client } from '../../domain/core/entities/client';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';
import { HashedValue } from '../../../../shared/value-objects/hashed-value';

@Injectable()
export class ClientPersistenceMapper extends BasePersistenceMapper<Client, ClientSchema> {
  domainToPersistence(domain: Client): ClientSchema {
    return {
      clientId: domain.id,
      clientSecrets: domain.clientSecrets.map(cs => ({ ...cs, value: cs.value.hash })),
      ...withoutAttrs(domain, ['id', 'clientSecrets']),
    };
  }

  persistenceToDomain(persistence: ClientSchema): Client {
    const domain = new Client(persistence.clientId);

    domain.clientSecrets = persistence.clientSecrets.map(cs => ({
      ...cs,
      value: new HashedValue(cs.value),
    }));
    domain.organization = persistence.organization;
    domain.tokens = persistence.tokens;
    domain.contacts = persistence.contacts;

    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain;
  }
}
