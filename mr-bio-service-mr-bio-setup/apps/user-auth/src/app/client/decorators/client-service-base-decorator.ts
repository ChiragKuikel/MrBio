import { Client } from '../domain/core/entities/client';
import { CreateClientDto } from '../domain/dtos/create-client';
import { ClientService } from '../domain/abstractions/client-service';
import { RefreshClientAccessTokenDto } from '../domain/dtos/refresh-client-access-token';
import { ClientWithGrantedPrivileges } from '../domain/dtos/client-with-granted-privileges';
import { ServiceOption, PaginatedResponse, CountResponse, IQuery } from '@mr-bio/core/shared';
import { RevokeClientSecretDto, RevokedClientSecret } from '../domain/dtos/revoke-client-secret';
import { CreateClientSecretDto, CreatedClientSecret } from '../domain/dtos/create-client-secret';
import {
  CreateClientAccessTokenDto,
  ClientAuthTokens,
} from '../domain/dtos/create-client-access-token';

export abstract class ClientServiceBaseDecorator implements ClientService {
  constructor(private clientService: ClientService) {}

  async revokeClientSecret(
    clientId: string,
    dto: RevokeClientSecretDto,
    option: ServiceOption
  ): Promise<RevokedClientSecret> {
    return await this.clientService.revokeClientSecret(clientId, dto, option);
  }

  async updateTokenUsage(clientId: string, tokenId: string, option?: ServiceOption): Promise<void> {
    return await this.clientService.updateTokenUsage(clientId, tokenId, option);
  }

  async validateClientToken(
    id: string,
    tokenId: string,
    option?: ServiceOption
  ): Promise<ClientWithGrantedPrivileges> {
    return await this.clientService.validateClientToken(id, tokenId, option);
  }

  async create(createDto: CreateClientDto, option?: ServiceOption): Promise<Client> {
    return await this.clientService.create(createDto, option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.clientService.count(query, option);
  }

  async get(query: IQuery, option?: ServiceOption): Promise<PaginatedResponse<Client>> {
    return await this.clientService.get(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Client> {
    return await this.clientService.getOneById(id, option);
  }

  async updateById(id: string, updateDto: Partial<{}>, option?: ServiceOption): Promise<Client> {
    return await this.clientService.updateById(id, updateDto, option);
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    return await this.clientService.deleteById(id, option);
  }

  async createClientSecret(
    clientId: string,
    dto: CreateClientSecretDto,
    option: ServiceOption
  ): Promise<CreatedClientSecret> {
    return await this.clientService.createClientSecret(clientId, dto, option);
  }

  async createClientAccessToken(
    clientId: string,
    dto: CreateClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens> {
    return await this.clientService.createClientAccessToken(clientId, dto, option);
  }

  async refreshClientAccessToken(
    dto: RefreshClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens> {
    return await this.clientService.refreshClientAccessToken(dto, option);
  }
}
