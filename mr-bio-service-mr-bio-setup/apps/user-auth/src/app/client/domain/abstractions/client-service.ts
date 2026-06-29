import { Client } from '../core/entities/client';
import { CreateClientDto } from '../dtos/create-client';
import { UpdateClientDto } from '../dtos/update-client';
import { BaseService, IQuery, ServiceOption } from '@mr-bio/core/shared';
import { RefreshClientAccessTokenDto } from '../dtos/refresh-client-access-token';
import { ClientWithGrantedPrivileges } from '../dtos/client-with-granted-privileges';
import { RevokeClientSecretDto, RevokedClientSecret } from '../dtos/revoke-client-secret';
import { CreateClientSecretDto, CreatedClientSecret } from '../dtos/create-client-secret';
import { CreateClientAccessTokenDto, ClientAuthTokens } from '../dtos/create-client-access-token';

export abstract class ClientService extends BaseService<
  Client,
  CreateClientDto,
  UpdateClientDto,
  IQuery
> {
  abstract validateClientToken(
    id: string,
    tokenId: string,
    option?: ServiceOption
  ): Promise<ClientWithGrantedPrivileges>;

  abstract updateTokenUsage(
    clientId: string,
    tokenId: string,
    option?: ServiceOption
  ): Promise<void>;

  abstract createClientSecret(
    clientId: string,
    dto: CreateClientSecretDto,
    option: ServiceOption
  ): Promise<CreatedClientSecret>;

  abstract revokeClientSecret(
    clientId: string,
    dto: RevokeClientSecretDto,
    option: ServiceOption
  ): Promise<RevokedClientSecret>;

  abstract createClientAccessToken(
    clientId: string,
    dto: CreateClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens>;

  abstract refreshClientAccessToken(
    dto: RefreshClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens>;
}
