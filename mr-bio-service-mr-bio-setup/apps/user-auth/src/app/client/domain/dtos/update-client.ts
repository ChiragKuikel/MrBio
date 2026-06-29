import { IContact } from '@mr-bio/core/shared';

export type UpdateClientDto = Partial<{
  contacts: IContact[];
}>;
