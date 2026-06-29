import { BaseEntity } from '@mr-bio/core/shared';

export class Lookup<T = any> extends BaseEntity {
  lookupId: string;
  code: LookupCode;
  value: T;

  initialize(builder: { code: LookupCode; value: T }) {
    this.code = builder.code;
    this.value = builder.value;
  }
}

export enum LookupCode {
  DEFAULT_NETWORK_SETTING = 'default_network_setting',
  DEFAULT_ORGANIZATION_SETTING = 'default_organization_setting',
}
