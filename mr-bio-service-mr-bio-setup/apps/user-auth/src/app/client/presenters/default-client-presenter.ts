import { Injectable } from '@nestjs/common';
import { AuthClient } from '@mr-bio/core/shared';
import { Client } from '../domain/core/entities/client';
import { ClientResponse } from './response/client-response';
import { ClientPresenter } from './abstractions/client-presenter';
import { CreatedClientSecret } from '../domain/dtos/create-client-secret';
import { ClientAuthTokens } from '../domain/dtos/create-client-access-token';
import { CreateClientSecretResponse } from './response/create-client-secret-response';
import { privilegesToGrantedResources } from '../../../shared/utils/associated-resource';
import { ClientWithGrantedPrivileges } from '../domain/dtos/client-with-granted-privileges';
import { CreateClientAccessTokenResponse } from './response/create-client-access-token-response';

@Injectable()
export class DefaultClientPresenter implements ClientPresenter {
  domainToPresentation(domain: Client): ClientResponse {
    return {
      id: domain.id,
      clientSecrets: domain.clientSecrets.map(clientSecret => ({
        clientSecretId: clientSecret.clientSecretId,
        name: clientSecret.name,
        allowedSources: clientSecret.allowedSources,
        created: clientSecret.created,
        updated: clientSecret.updated,
        revoked: clientSecret.revoked,
        usageCount: clientSecret.usageCount,
        lastUsedAt: clientSecret.lastUsedAt,
      })),
      organization: domain.organization,
      contacts: domain.contacts,
    };
  }

  findAllDomainToPresentation(domain: Client[]): ClientResponse[] {
    return domain.map(this.domainToPresentation);
  }

  clientWithGrantedPrivilegesToAuthClient(client: ClientWithGrantedPrivileges): AuthClient {
    return {
      grantedResources: privilegesToGrantedResources(client.grantedPrivileges),
      id: client.id,
      tokenId: client.tokenId,
      allowedSources: client.allowedSources,
      grantType: client.grantType,
      // organizationId: client.organizationId,
      // organizationName: client.organizationName,
      roles: client.grantedPrivileges.roles.map(r => r.code),
      // networkIds: client.networkIds,
    };
  }

  createdClientSecretToResponse(
    createdClientSecret: CreatedClientSecret
  ): CreateClientSecretResponse {
    return {
      clientId: createdClientSecret.clientId,
      clientSecret: createdClientSecret.clientSecret,
      name: createdClientSecret.name,
      allowedSources: createdClientSecret.allowedSources,
    };
  }
  clientAuthTokensToResponse(clientAuthTokens: ClientAuthTokens): CreateClientAccessTokenResponse {
    return {
      accessToken: clientAuthTokens.accessToken,
      refreshToken: clientAuthTokens.refreshToken,
    };
  }
}
