import { Injectable } from '@nestjs/common';
import { Client } from '../domain/core/entities/client';
import { CreateClientDto } from '../domain/dtos/create-client';
import { UpdateClientDto } from '../domain/dtos/update-client';
import { ClientService } from '../domain/abstractions/client-service';
import { ClientServiceBaseDecorator } from './client-service-base-decorator';
import { RevokeClientSecretDto, RevokedClientSecret } from '../domain/dtos/revoke-client-secret';
import { CreateClientSecretDto, CreatedClientSecret } from '../domain/dtos/create-client-secret';
import {
  CreateClientAccessTokenDto,
  ClientAuthTokens,
} from '../domain/dtos/create-client-access-token';
import {
  EntityActivityLogPublisher,
  EntityActivityLogPublisherFactory,
  FindAllResponse,
  getFullName,
  IQuery,
  isAuthEntityUser,
  PaginatedResponse,
  ProjectModule,
  ServiceOption,
  withOnlyAttrs,
} from '@mr-bio/core/shared';

@Injectable()
export class ClientServiceActivityLogDecorator extends ClientServiceBaseDecorator {
  module: ProjectModule = ProjectModule.CLIENT;
  activityLogPublisher: EntityActivityLogPublisher<Client>;

  constructor(
    clientService: ClientService,
    activityLogPublisherFactory: EntityActivityLogPublisherFactory
  ) {
    super(clientService);
    this.activityLogPublisher = activityLogPublisherFactory.create(this.module);
  }

  async create(createDto: CreateClientDto, option?: ServiceOption): Promise<Client> {
    const client = await super.create(createDto, option);

    this.activityLogPublisher.publishCreateLog(
      client,
      withOnlyAttrs(client, ['organization', 'contacts']),
      option
    );

    return client;
  }

  async updateById(
    id: string,
    updateDto: UpdateClientDto,
    option?: ServiceOption
  ): Promise<Client> {
    const client = await super.getOneById(id, option);

    const updatedClient = await super.updateById(id, updateDto, option);

    this.activityLogPublisher.publishUpdateLog(client, updatedClient, option);

    return updatedClient;
  }

  async get(query: IQuery, option?: ServiceOption): Promise<PaginatedResponse<Client>> {
    const result = super.get(query, option);

    this.activityLogPublisher.publishSearchLog(query, option);

    return result;
  }

  getOneById(id: string, option?: ServiceOption): Promise<Client> {
    const client = super.getOneById(id, option);

    this.activityLogPublisher.publishSearchLog({ id }, option);

    return client;
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    await super.deleteById(id, option);

    this.activityLogPublisher.publishDeleteLog(id, option);
  }

  async createClientSecret(
    clientId: string,
    dto: CreateClientSecretDto,
    option: ServiceOption
  ): Promise<CreatedClientSecret> {
    const createdClientSecret = await super.createClientSecret(clientId, dto, option);

    let note = '';

    if (isAuthEntityUser(option.authEntity!)) {
      note = `${getFullName(option.authEntity!)} created a client secret.`;
    } else {
      note = `A new client secret was created.`;
    }

    this.activityLogPublisher.publishLogEvent(
      {
        eventType: 'ADD',
        module: this.module,
        userVisibility: true,
        note,
        attributes: {
          reference: {
            refId: clientId,
            projectModule: ProjectModule.CLIENT,
          },
          data: withOnlyAttrs(createdClientSecret, ['clientSecretId', 'name']),
        },
      },
      option.authEntity
    );

    return createdClientSecret;
  }

  async revokeClientSecret(
    clientId: string,
    dto: RevokeClientSecretDto,
    option: ServiceOption
  ): Promise<RevokedClientSecret> {
    const revokedClientSecret = await super.revokeClientSecret(clientId, dto, option);

    this.activityLogPublisher.publishLogEvent(
      {
        eventType: 'DELETE',
        module: this.module,
        userVisibility: false,
        note: 'A client secret was revoked.',
        attributes: {
          reference: {
            refId: clientId,
            projectModule: this.module,
          },
          data: withOnlyAttrs(revokedClientSecret, ['clientSecretId', 'name']),
        },
      },
      option.authEntity
    );

    return revokedClientSecret;
  }

  async createClientAccessToken(
    clientId: string,
    dto: CreateClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens> {
    const clientAuthTokens = await super.createClientAccessToken(clientId, dto, option);

    this.activityLogPublisher.publishLogEvent(
      {
        eventType: 'ADD',
        module: this.module,
        userVisibility: false,
        note: 'A new access token was created.',
        attributes: {
          reference: {
            refId: clientId,
            projectModule: this.module,
          },
          data: withOnlyAttrs(clientAuthTokens, ['tokenId']),
        },
      },
      option.authEntity
    );

    return clientAuthTokens;
  }
}
