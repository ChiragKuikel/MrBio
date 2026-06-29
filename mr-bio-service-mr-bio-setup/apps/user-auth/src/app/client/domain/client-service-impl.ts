import { Injectable } from '@nestjs/common';
import { Client } from './core/entities/client';
import { CreateClientDto } from './dtos/create-client';
import { UpdateClientDto } from './dtos/update-client';
import { ClientService } from './abstractions/client-service';
import { ClientRepository } from '../repository/abstractions/client-repository';
import { RefreshClientAccessTokenDto } from './dtos/refresh-client-access-token';
import { RoleService } from '../../authorization/domain/abstractions/role-service';
import { ClientWithGrantedPrivileges } from './dtos/client-with-granted-privileges';
import { RevokeClientSecretDto, RevokedClientSecret } from './dtos/revoke-client-secret';
import { CreateClientSecretDto, CreatedClientSecret } from './dtos/create-client-secret';
import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';
import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';
import { CreateClientAccessTokenDto, ClientAuthTokens } from './dtos/create-client-access-token';
import {
  ACCESS_TOKEN_EXPIRY_TIME_IN_MIN,
  REFRESH_TOKEN_EXPIRY_TIME_IN_MIN,
  RedisPrefix,
  errorMessage,
} from '../../../shared/constants';
import {
  FindAllResponse,
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  CountResponse,
  ProjectModule,
  ConflictException,
  // Cache,
  AuthClient,
  AuthGrantType,
  TokenHelper,
  ClientRefreshTokenPayload,
  UnauthorizedException,
  extractAuthEntity,
  resolveAssigner,
  getCacheKey,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class ClientServiceImpl implements ClientService {
  constructor(
    private readonly clientRepository: ClientRepository,
    // private readonly redisCache: Cache,
    private networkServiceClient: NetworkServiceClient,
    private roleService: RoleService,
    private tokenHelper: TokenHelper,
    private configService: UserAuthConfigService
  ) {}

  async validateClientToken(
    clientId: string,
    tokenId: string,
    option?: ServiceOption
  ): Promise<ClientWithGrantedPrivileges> {
    const client = await this.getOneById(clientId, option);

    const token = client.findToken(tokenId);
    if (!token) throw new UnauthorizedException();

    if (client.hasTokenBeenRevoked(tokenId)) throw new UnauthorizedException();

    const grantedClientPrivileges = await this.roleService.getRolePrivilegesByCodes(
      token.roles,
      option
    );

    return {
      id: client.id,
      tokenId: token.tokenId,
      allowedSources: token.allowedSources,
      grantType: AuthGrantType.CLIENT_CREDENTIALS,
      organizationId: client.organization.id,
      organizationName: client.organization.name,
      grantedPrivileges: grantedClientPrivileges,
      networkIds: token.networkIds,
    };
  }

  async updateTokenUsage(clientId: string, tokenId: string, option?: ServiceOption): Promise<void> {
    const client = await this.getOneById(clientId, option);
    client.updateTokenUsage(tokenId);
    await this.clientRepository.update(client, option);
  }

  async create(createDto: CreateClientDto, option: ServiceOption): Promise<Client> {
    const authEntity = extractAuthEntity(option);

    // const organization = await this.networkServiceClient.getOrganizationById(
    //   authEntity.organizationId,
    //   option
    // );

    // const existingClient = await this.clientRepository.findByOrganizationId(
    //   // organization.id,
    //   option
    // );

    // if (existingClient)
    //   throw new ConflictException(
    //     formatModuleMessage(coreErrorMessage.MODULE_ALREADY_EXISTS, ProjectModule.CLIENT)
    //   );

    // const client = new Client();
    // client.initialize({
    // organization: {
    //   id: organization.id,
    //   code: organization.code,
    //   name: organization.name,
    // },
    // contacts: createDto.contacts,
    // });

    return await this.clientRepository.create(new Client(), option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.clientRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<Client>> {
    return await this.clientRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Client> {
    //need to move this to repository layer - TBD
    // const cachedClient = await this.redisCache.getData<Client>(getCacheKey(RedisPrefix.CLIENT, id));
    // if (cachedClient) return cachedClient;

    const client = await this.clientRepository.findOneById(id, option);
    if (!client) {
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CLIENT)
      );
    }
    // await this.redisCache.setData<Client>(getCacheKey(RedisPrefix.CLIENT, id), client);

    return client;
  }

  async updateById(id: string, updateDto: UpdateClientDto, option: ServiceOption): Promise<Client> {
    const updatedClient = await this.clientRepository.updateById(id, updateDto, option);
    if (!updatedClient)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CLIENT)
      );

    return updatedClient;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.clientRepository.deleteById(id, option);
  }

  async createClientSecret(
    clientId: string,
    dto: CreateClientSecretDto,
    option: ServiceOption
  ): Promise<CreatedClientSecret> {
    const client = await this.getOneById(clientId, option);

    const clientSecret = client.createClientSecret({
      ...dto,
      created: resolveAssigner(option),
    });

    await this.clientRepository.update(client, option);

    return {
      clientId: client.id,
      clientSecretId: clientSecret.clientSecretId,
      clientSecret: clientSecret.plainSecret,
      name: dto.name,
      allowedSources: dto.allowedSources,
    };
  }

  async revokeClientSecret(
    clientId: string,
    dto: RevokeClientSecretDto,
    option: ServiceOption
  ): Promise<RevokedClientSecret> {
    const client = await this.getOneById(clientId, option);

    const revokedClientSecret = client.revokeClientSecret({
      clientSecret: dto.clientSecret,
      revoked: resolveAssigner(option),
    });

    await this.clientRepository.update(client, option);

    return {
      clientId: client.id,
      clientSecretId: revokedClientSecret.clientSecretId,
      name: revokedClientSecret.name,
    };
  }

  async createClientAccessToken(
    clientId: string,
    dto: CreateClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens> {
    const client = await this.getOneById(clientId, option);

    const token = client.createToken({
      clientSecret: dto.clientSecret,
      roles: dto.roles,
      networkIds: dto.networkIds,
    });

    const clientSecret = client.findClientSecret(dto.clientSecret);
    if (!clientSecret) throw new NotFoundException(errorMessage.INVALID_CLIENT_SECRET);

    const tokens = this._createClientTokens(client, {
      tokenId: token.tokenId,
      roles: dto.roles,
      networkIds: dto.networkIds,
      allowedSources: clientSecret.allowedSources,
    });

    await this.clientRepository.update(client, option);

    return {
      tokenId: token.tokenId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async refreshClientAccessToken(
    dto: RefreshClientAccessTokenDto,
    option: ServiceOption
  ): Promise<ClientAuthTokens> {
    const client = await this.getOneById(dto.clientId, option);

    const token = client.refreshToken(dto.tokenId);

    const tokens = this._createClientTokens(client, {
      tokenId: token.tokenId,
      roles: token.roles,
      networkIds: token.networkIds,
      allowedSources: token.allowedSources,
    });

    await this.clientRepository.update(client, option);

    return {
      tokenId: token.tokenId,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  private _createClientTokens(
    client: Client,
    tokenDetails: {
      tokenId: string;
      roles: string[];
      networkIds?: string[];
      allowedSources: string[];
    }
  ): { accessToken: string; refreshToken: string } {
    const authClient: AuthClient = {
      id: client.id,
      tokenId: tokenDetails.tokenId,
      roles: tokenDetails.roles,
      // organizationId: client.organization.id,
      // organizationName: client.organization.name,
      grantedResources: [],
      allowedSources: tokenDetails.allowedSources,
      grantType: AuthGrantType.CLIENT_CREDENTIALS,
      // networkIds: tokenDetails.networkIds,
    };
    const accessToken = this.tokenHelper.generate(
      authClient,
      this.configService.auth.authTokenSecret,
      ACCESS_TOKEN_EXPIRY_TIME_IN_MIN
    );

    const refreshTokenPayload: ClientRefreshTokenPayload = {
      clientId: client.id,
      tokenId: tokenDetails.tokenId,
    };
    const refreshToken = this.tokenHelper.generate(
      refreshTokenPayload,
      this.configService.auth.authTokenSecret,
      REFRESH_TOKEN_EXPIRY_TIME_IN_MIN
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
