// import { mock } from 'jest-mock-extended';
// import { CreateClientDto } from './dtos/create-client';
// import { UpdateClientDto } from './dtos/update-client';
// import { ClientServiceImpl } from './client-service-impl';
// import { ClientService } from './abstractions/client-service';
// import { Client, ClientBuilder } from './core/entities/client';
// import { CreateClientSecretDto } from './dtos/create-client-secret';
// import { CreateClientAccessTokenDto } from './dtos/create-client-access-token';
// import { ClientRepository } from '../repository/abstractions/client-repository';
// import { RoleService } from '../../authorization/domain/abstractions/role-service';
// import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';
// import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';
// import {
//   AuthGrantType,
//   // Cache,
//   ConflictException,
//   ContactType,
//   NotFoundException,
//   OrganizationReference,
//   RoleCode,
//   TokenHelper,
//   UnauthorizedException,
// } from '@mr-bio/core/shared';

// jest.mock('./core/entities/client.ts', () => {
//   const actual = jest.requireActual('./core/entities/client.ts');

//   return {
//     ...actual,
//     Client: function () {
//       return {
//         ...actual.Client,
//         initialize: jest.fn(),
//         createClientSecret: jest.fn(),
//         createToken: jest.fn(),
//         findClientSecret: jest.fn(),
//         findToken: jest.fn(),
//         hasTokenBeenRevoked: jest.fn(),
//       };
//     },
//   };
// });

// describe('ClientServiceImpl', () => {
//   let clientService: ClientService;
//   const clientRepository = mock<ClientRepository>();
//   const networkServiceClient = mock<NetworkServiceClient>();
//   const tokenHelper = mock<TokenHelper>();
//   const roleService = mock<RoleService>();
//   const redisCache = mock<Cache>();
//   const configService = mock<UserAuthConfigService>();

//   beforeEach(() => {
//     clientService = new ClientServiceImpl(
//       clientRepository,
//       // redisCache,
//       networkServiceClient,
//       roleService,
//       tokenHelper,
//       configService
//     );
//   });

//   describe('create', () => {
//     it('should throw NotFoundException if given organization is not found', async () => {
//       // Arrange
//       const createClientDto = {} as CreateClientDto;
//       networkServiceClient.getOrganizationById.mockRejectedValue(
//         new NotFoundException('error message')
//       );

//       // Act
//       const createPromise = clientService.create(createClientDto, {
//         authEntity: {
//           organizationId: 'nonexistentOrganizationId',
//           roles: [RoleCode.ORGANIZATION_ADMIN],
//         } as any,
//       });

//       // Assert
//       await expect(createPromise).rejects.toThrow(new NotFoundException('error message'));
//     });

//     it('should throw ConflictException if a client already exists for the organization', async () => {
//       // Arrange
//       const createClientDto = {} as CreateClientDto;

//       networkServiceClient.getOrganizationById.mockResolvedValue({} as any);
//       clientRepository.findByOrganizationId.mockResolvedValue(new Client());

//       // Act
//       const createPromise = clientService.create(createClientDto, {
//         authEntity: {
//           organizationId: 'organization_id',
//           roles: [RoleCode.NETWORK_ADMIN],
//         } as any,
//       });

//       // Assert
//       await expect(createPromise).rejects.toThrow(ConflictException);
//     });

//     it('should initialize physician with correct builder', async () => {
//       // Arrange
//       const createClientDto = {
//         contacts: [
//           {
//             email: 'email1',
//             phone: { value: '1234567890' },
//             type: ContactType.BILLING,
//           },
//         ],
//       } as CreateClientDto;

//       const organization = {
//         id: 'organization_id',
//         code: 'organization_code',
//         name: 'organization_name',
//       } as OrganizationReference;

//       const expectedClientBuilder = {
//         organization: {
//           id: 'organization_id',
//           code: 'organization_code',
//           name: 'organization_name',
//         },
//         contacts: [
//           {
//             email: 'email1',
//             phone: { value: '1234567890' },
//             type: ContactType.BILLING,
//           },
//         ],
//       } as ClientBuilder;

//       networkServiceClient.getOrganizationById.mockResolvedValue(organization as any);
//       clientRepository.findByOrganizationId.mockResolvedValue(null);
//       clientRepository.create.mockImplementation(async client => client);

//       // Act
//       const client = await clientService.create(createClientDto, {
//         authEntity: {
//           organizationId: 'organization_id',
//           roles: [RoleCode.ORGANIZATION_ADMIN],
//         } as any,
//       });

//       // Assert
//       expect(client.initialize).toHaveBeenCalledWith(expectedClientBuilder);
//     });
//   });

//   describe('updateById', () => {
//     it('should throw NotFoundException if given client is not found', async () => {
//       // Arrange
//       const updateClientDto = {} as UpdateClientDto;
//       clientRepository.updateById.mockResolvedValue(null);

//       // Act
//       const updatePromise = clientService.updateById('client_id', updateClientDto);

//       // Assert
//       await expect(updatePromise).rejects.toThrow(NotFoundException);
//     });
//   });

//   describe('createClientSecret', () => {
//     it('should throw NotFoundException if given client is not found', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       clientRepository.findOneById.mockResolvedValue(null);

//       // Act
//       const createPromise = clientService.createClientSecret(clientId, {} as any, {});

//       // Assert
//       await expect(createPromise).rejects.toThrow(NotFoundException);
//     });

//     it('should create a client secret', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const createClientSecretDto = {
//         name: 'client_secret_name',
//         allowedSources: ['allowed_IP'],
//       } as CreateClientSecretDto;

//       const client = new Client();
//       client.id = clientId;
//       clientRepository.findOneById.mockResolvedValue(client);

//       jest.spyOn(client, 'createClientSecret').mockImplementation(
//         () =>
//           ({
//             clientSecretId: 'client_secret_id',
//             plainSecret: 'client_secret_value',
//           }) as any
//       );

//       const expectedResponse = {
//         clientId: clientId,
//         clientSecretId: 'client_secret_id',
//         clientSecret: 'client_secret_value',
//         name: 'client_secret_name',
//         allowedSources: ['allowed_IP'],
//       };

//       // Act
//       const createdClientSecret = await clientService.createClientSecret(
//         clientId,
//         createClientSecretDto,
//         {}
//       );

//       // Assert
//       expect(createdClientSecret).toEqual(expectedResponse);
//     });
//   });

//   describe('createClientAccessToken', () => {
//     it('should throw NotFoundException if given client is not found', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       clientRepository.findOneById.mockResolvedValue(null);

//       // Act
//       const createPromise = clientService.createClientAccessToken(clientId, {} as any, {});

//       // Assert
//       await expect(createPromise).rejects.toThrow(NotFoundException);
//     });

//     it('should throw NotFoundException if given client secret is not found', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const createClientAccessTokenDto = {
//         clientSecret: 'non_existent_client_secret',
//         roles: [RoleCode.ORGANIZATION_ADMIN],
//         networkIds: ['network_id'],
//       } as CreateClientAccessTokenDto;

//       const client = new Client();
//       client.clientSecrets = [{ clientSecretId: 'client_secret_id' }] as any;
//       clientRepository.findOneById.mockResolvedValue(client);
//       jest.spyOn(client, 'findClientSecret').mockImplementation(() => undefined);

//       // Act
//       const createPromise = clientService.createClientAccessToken(
//         clientId,
//         createClientAccessTokenDto,
//         {}
//       );

//       // Assert
//       await expect(createPromise).rejects.toThrow(NotFoundException);
//     });

//     it('should create a client access token', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const createClientAccessTokenDto = {
//         clientSecret: 'client_secret_id',
//         roles: [RoleCode.ORGANIZATION_ADMIN],
//         networkIds: ['network_id'],
//       } as CreateClientAccessTokenDto;

//       const client = new Client();
//       client.organization = { id: 'organization_id', name: 'organization_name' } as any;
//       client.clientSecrets = [{ clientSecretId: 'client_secret_id' }] as any;

//       clientRepository.findOneById.mockResolvedValue(client);
//       jest.spyOn(client, 'findClientSecret').mockImplementation(
//         () =>
//           ({
//             clientSecretId: 'client_secret_id',
//           }) as any
//       );
//       jest.spyOn(client, 'createToken').mockImplementation(
//         () =>
//           ({
//             tokenId: 'token_id',
//           }) as any
//       );
//       tokenHelper.generate.mockReturnValueOnce('access_token');
//       tokenHelper.generate.mockReturnValueOnce('refresh_token');

//       const expectedResponse = {
//         tokenId: 'token_id',
//         accessToken: 'access_token',
//         refreshToken: 'refresh_token',
//       };

//       // Act
//       const clientAuthTokens = await clientService.createClientAccessToken(
//         clientId,
//         createClientAccessTokenDto,
//         {}
//       );

//       // Assert
//       expect(clientAuthTokens).toEqual(expectedResponse);
//     });
//   });

//   describe('validateClientToken', () => {
//     it('should throw UnauthorizedException if given token is not found', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const tokenId = 'token_id';

//       const client = new Client();
//       client.id = clientId;

//       clientRepository.findOneById.mockResolvedValue(client);
//       jest.spyOn(client, 'findToken').mockImplementation(() => undefined);

//       // Act
//       const validatePromise = clientService.validateClientToken(clientId, tokenId);

//       // Assert
//       await expect(validatePromise).rejects.toThrow(UnauthorizedException);
//     });

//     it('should throw UnauthorizedException if given token has been revoked', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const tokenId = 'token_id';

//       const client = new Client();
//       client.id = clientId;
//       client.tokens = [{ tokenId, revokedAt: new Date() }] as any;

//       clientRepository.findOneById.mockResolvedValue(client);
//       jest.spyOn(client, 'hasTokenBeenRevoked').mockImplementation(() => true);

//       // Act
//       const validatePromise = clientService.validateClientToken(clientId, tokenId);

//       // Assert
//       await expect(validatePromise).rejects.toThrow(UnauthorizedException);
//     });

//     it('should return a client with granted privileges', async () => {
//       // Arrange
//       const clientId = 'client_id';
//       const tokenId = 'token_id';

//       const client = new Client();
//       client.id = clientId;
//       client.organization = { id: 'organization_id', name: 'organization_name' } as any;
//       client.tokens = [{ tokenId }] as any;

//       clientRepository.findOneById.mockResolvedValue(client);
//       jest.spyOn(client, 'findToken').mockImplementation(
//         () =>
//           ({
//             tokenId,
//             roles: [RoleCode.ORGANIZATION_ADMIN],
//             networkIds: ['network_id'],
//             allowedSources: ['allowed_source'],
//           }) as any
//       );
//       jest.spyOn(client, 'hasTokenBeenRevoked').mockImplementation(() => false);

//       roleService.getRolePrivilegesByCodes.mockResolvedValue({
//         roles: [],
//         resources: [],
//       });

//       const expectedResponse = {
//         id: clientId,
//         tokenId: tokenId,
//         allowedSources: ['allowed_source'],
//         grantType: AuthGrantType.CLIENT_CREDENTIALS,
//         organizationId: 'organization_id',
//         organizationName: 'organization_name',
//         grantedPrivileges: {
//           roles: [],
//           resources: [],
//         },
//         networkIds: ['network_id'],
//       };

//       // Act
//       const validateClientTokenResponse = await clientService.validateClientToken(
//         clientId,
//         tokenId
//       );

//       // Assert
//       expect(validateClientTokenResponse).toEqual(expectedResponse);
//     });
//   });
// });
