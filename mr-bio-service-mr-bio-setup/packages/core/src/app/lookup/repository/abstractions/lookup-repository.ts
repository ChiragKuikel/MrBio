import { Nullable, ServiceOption } from '@mr-bio/core/shared';
import { Lookup, LookupCode } from '../../domain/core/entities/lookup';

export abstract class LookupRepository {
  abstract findByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Nullable<Lookup<T>>>;
}
