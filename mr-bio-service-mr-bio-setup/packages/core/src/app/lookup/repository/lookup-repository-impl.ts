import { Injectable } from '@nestjs/common';
import { LookupModel } from './models/lookup-model';
import { Nullable, ServiceOption } from '@mr-bio/core/shared';
import { Lookup, LookupCode } from '../domain/core/entities/lookup';
import { LookupRepository } from './abstractions/lookup-repository';
import { LookupPersistenceMapper } from './mappers/lookup-persistence-mapper';

@Injectable()
export class LookupRepositoryImpl implements LookupRepository {
  constructor(
    protected model: LookupModel,
    protected mapper: LookupPersistenceMapper
  ) {}

  async findByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Nullable<Lookup<T>>> {
    const lookup = await this.model.findOne({ code }, option);
    if (!lookup) {
      return null;
    }

    return this.mapper.persistenceToDomain(lookup) as unknown as Lookup<T>;
  }
}
