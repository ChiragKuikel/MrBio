import { BaseSchema } from '@mr-bio/core/external-lib';
import { LookupCode } from '../../domain/core/entities/lookup';

export interface ILookup<T = any> {
  lookupId: string;
  code: LookupCode;
  value: T;
}

export type LookupSchema<T = any> = ILookup<T> & BaseSchema;
