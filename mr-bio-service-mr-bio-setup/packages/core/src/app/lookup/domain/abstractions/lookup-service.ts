import { Nullable, ServiceOption } from '../../../../shared';
import { Lookup, LookupCode } from '../core/entities/lookup';

export abstract class LookupService {
  abstract findByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Nullable<Lookup<T>>>;
  abstract getByCode<T>(code: LookupCode, option?: ServiceOption): Promise<Lookup<T>>;
}
