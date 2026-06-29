import { Client } from '../../domain/core/entities/client';
import { ClientResponse } from '../response/client-response';
import { FindAllResponse, AuthClient } from '@mr-bio/core/shared';
import { CreatedClientSecret } from '../../domain/dtos/create-client-secret';
import { ClientAuthTokens } from '../../domain/dtos/create-client-access-token';
import { CreateClientSecretResponse } from '../response/create-client-secret-response';
import { ClientWithGrantedPrivileges } from '../../domain/dtos/client-with-granted-privileges';
import { CreateClientAccessTokenResponse } from '../response/create-client-access-token-response';

export abstract class ClientPresenter {
  abstract domainToPresentation(domain: Client): ClientResponse;
  abstract findAllDomainToPresentation(
    domain: FindAllResponse<Client>
  ): FindAllResponse<ClientResponse>;
  abstract clientWithGrantedPrivilegesToAuthClient(client: ClientWithGrantedPrivileges): AuthClient;

  abstract createdClientSecretToResponse(
    createdClientSecret: CreatedClientSecret
  ): CreateClientSecretResponse;
  abstract clientAuthTokensToResponse(
    clientAuthTokens: ClientAuthTokens
  ): CreateClientAccessTokenResponse;
}
