import { Injectable } from '@nestjs/common';
import { Lookup, LookupCode } from './core/entities/lookup';
import { LookupService } from './abstractions/lookup-service';
import { LookupRepository } from '../repository/abstractions/lookup-repository';
import {
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  ProjectModule,
  Nullable,
} from '@mr-bio/core/shared';

@Injectable()
export class LookupServiceImpl implements LookupService {
  constructor(private lookupRepository: LookupRepository) {}

  async findByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Nullable<Lookup<T>>> {
    return await this.lookupRepository.findByCode(code, option);
  }

  async getByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Lookup<T>> {
    const lookup = await this.lookupRepository.findByCode(code, option);
    if (!lookup) {
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.LOOKUP)
      );
    }

    return lookup as Lookup<T>;
  }
}
