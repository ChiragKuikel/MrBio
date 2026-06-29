import { Injectable } from '@nestjs/common';
import { LookupSchema } from '../schemas/lookup-schema';
import { Lookup } from '../../domain/core/entities/lookup';
import { BasePersistenceMapper, withoutAttrs } from '@mr-bio/core/shared';

@Injectable()
export class LookupPersistenceMapper extends BasePersistenceMapper<Lookup, LookupSchema> {
  domainToPersistence(domain: Lookup): LookupSchema {
    return {
      ...withoutAttrs(domain, ['id']),
    };
  }

  persistenceToDomain(persistence: LookupSchema): Lookup {
    const domain = new Lookup(persistence.lookupId);
    domain.code = persistence.code;
    domain.value = persistence.value;
    domain.created = persistence.created;
    domain.updated = persistence.updated;

    return domain as Lookup;
  }
}
