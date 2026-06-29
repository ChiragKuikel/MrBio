import { IContact } from '@mr-bio/core/shared';
import { BaseSchema } from '@mr-bio/core/external-lib';
import { ClientSecret, ClientToken } from '../../domain/core/entities/client';

export interface IClient {
  clientId: string;
  clientSecrets: (Omit<ClientSecret, 'value'> & { value: string })[];
  organization: {
    id: string;
    code: string;
    name: string;
  };
  tokens: ClientToken[];
  contacts?: IContact[];
}

export type ClientSchema = IClient & BaseSchema;
