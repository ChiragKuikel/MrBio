import { Assigner, IContact } from '@mr-bio/core/shared';

export type ClientResponse = {
  id: string;
  clientSecrets: ClientResponseSecret[];
  organization: {
    id: string;
    code: string;
    name: string;
  };
  contacts?: IContact[];
};

export type ClientResponseSecret = {
  name: string;
  allowedSources: string[];
  usageCount?: number;
  lastUsedAt?: Date;
  created: Assigner;
  updated?: Assigner;
  revoked?: Assigner;
};
