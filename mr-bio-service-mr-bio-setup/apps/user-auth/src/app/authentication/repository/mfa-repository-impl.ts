import { Injectable } from '@nestjs/common';
import { MfaModel } from './models/mfa-model';
import { MfaSchema } from './schemas/mfa-schema';
import { Mfa } from '../domain/core/entities/mfa';
import { MfaRepository } from './abstractions/mfa-repository';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { MfaPersistenceMapper } from './mappers/mfa-persistence-mapper';

@Injectable()
export class MfaRepositoryImpl extends BaseRepositoryImpl<Mfa, MfaSchema> implements MfaRepository {
  constructor(
    protected model: MfaModel,
    protected mapper: MfaPersistenceMapper
  ) {
    super(model, mapper);
  }
}
