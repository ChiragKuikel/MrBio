import { Client, ClientBuilder } from './client';
import { ContactType, UnauthorizedException } from '@mr-bio/core/shared';
import { HashedValue } from '../../../../../shared/value-objects/hashed-value';

describe('Client', () => {
  const organization = {
    id: 'organization_id',
    name: 'organization_name',
    code: 'organization_code',
  };

  describe('initialize', () => {
    it('should perform the initialization correctly', () => {
      // Arrange
      const mockClientBuilder = {
        organization,
        contacts: [
          {
            email: 'email1',
            phone: { value: '1234567890' },
            type: ContactType.BILLING,
          },
        ],
      } as ClientBuilder;

      const expectedClient = new Client('client_id');
      expectedClient.clientSecrets = [];
      expectedClient.tokens = [];
      expectedClient.organization = mockClientBuilder.organization;
      expectedClient.contacts = mockClientBuilder.contacts;

      // Act
      const client = new Client('client_id');
      client.initialize(mockClientBuilder);

      // Assert
      expect(client).toEqual(expect.objectContaining(expectedClient));
    });
  });

  describe('createClientSecret', () => {
    it('should add a client secret to the client', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });

      // Act
      client.createClientSecret({
        name: 'client_secret_name',
        allowedSources: ['allowed_IP'],
        created: { by: 'user_name' },
      });

      // Assert
      expect(client.clientSecrets.length).toBe(1);
      expect(client.clientSecrets[0]).toEqual(
        expect.objectContaining({
          name: 'client_secret_name',
          allowedSources: ['allowed_IP'],
          created: { by: 'user_name' },
        })
      );
      expect(client.clientSecrets[0]!.value.hash).toBeDefined();
    });
  });

  describe('createToken', () => {
    it('should throw UnauthorizedException if the client secret is not found', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [];

      // Act
      const createToken = () =>
        client.createToken({
          clientSecret: 'client_secret',
          roles: ['role1'],
          networkIds: ['network_id'],
        });

      // Assert
      expect(createToken).toThrow(UnauthorizedException);
    });

    it('should create a token for the client', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [
        {
          clientSecretId: 'client_secret_id',
          name: 'client_secret_name',
          value: HashedValue.fromValue('client_secret'),
          allowedSources: ['allowed_IP'],
          usageCount: 1,
          created: { by: 'user_name' },
        },
      ];

      // Act
      const token = client.createToken({
        clientSecret: 'client_secret',
        roles: ['role1'],
        networkIds: ['network_id'],
      });

      // Assert
      expect(client.tokens.length).toBe(1);
      expect(token).toEqual(
        expect.objectContaining({
          roles: ['role1'],
          networkIds: ['network_id'],
          allowedSources: ['allowed_IP'],
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
          clientSecretId: 'client_secret_id',
        })
      );
      expect(client.clientSecrets[0]!.lastUsedAt).toEqual(expect.any(Date));
      expect(client.clientSecrets[0]!.usageCount).toBe(2);
    });
  });

  describe('findClientSecret', () => {
    it('should return the client secret if it exists', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      const expectedClientSecret = {
        clientSecretId: 'client_secret_id',
        value: HashedValue.fromValue('client_secret'),
        name: 'client_secret_name',
        allowedSources: ['allowed_IP'],
        usageCount: 1,
        created: { by: 'user_name' },
      };
      client.clientSecrets = [expectedClientSecret];

      // Act
      const clientSecret = client.findClientSecret('client_secret');

      // Assert
      expect(clientSecret).toEqual(expectedClientSecret);
    });

    it('should return undefined if the client secret is not found', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [];

      // Act
      const clientSecret = client.findClientSecret('client_secret');

      // Assert
      expect(clientSecret).toBeUndefined();
    });
  });

  describe('revokeClientSecret', () => {
    it('should throw UnauthorizedException if the client secret is not found', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [];

      // Act
      const revokeClientSecret = () =>
        client.revokeClientSecret({ clientSecret: 'client_secret', revoked: {} });

      // Assert
      expect(revokeClientSecret).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the client secret is already revoked', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [
        {
          clientSecretId: 'client_secret_id',
          value: HashedValue.fromValue('client_secret'),
          name: 'client_secret_name',
          allowedSources: ['allowed_IP'],
          usageCount: 1,
          created: { by: 'user_name' },
          revoked: {},
        },
      ];

      // Act
      const revokeClientSecret = () =>
        client.revokeClientSecret({ clientSecret: 'client_secret', revoked: {} });

      // Assert
      expect(revokeClientSecret).toThrow(UnauthorizedException);
    });

    it('should revoke the client secret', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.clientSecrets = [
        {
          clientSecretId: 'client_secret_id',
          value: HashedValue.fromValue('client_secret'),
          name: 'client_secret_name',
          allowedSources: ['allowed_IP'],
          usageCount: 1,
          created: { by: 'user_name' },
        },
      ];
      client.tokens = [
        {
          tokenId: 'token_id',
          clientSecretId: 'client_secret_id',
          issuedAt: new Date(),
          expiresAt: new Date(),
          allowedSources: ['allowed_IP'],
          roles: ['role1'],
          networkIds: ['network_id'],
        },
      ];

      // Act
      client.revokeClientSecret({ clientSecret: 'client_secret', revoked: { by: 'revoker' } });

      // Assert
      expect(client.clientSecrets[0]!.revoked).toEqual({ by: 'revoker' });
      expect(client.tokens[0]!.revokedAt).toEqual(expect.any(Date));
    });
  });

  describe('hasTokenBeenRevoked', () => {
    it('should return true if the token has been revoked', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.tokens = [
        {
          tokenId: 'token_id',
          clientSecretId: 'client_secret_id',
          revokedAt: new Date(),
        } as any,
      ];

      // Act
      const hasTokenBeenRevoked = client.hasTokenBeenRevoked('token_id');

      // Assert
      expect(hasTokenBeenRevoked).toBe(true);
    });

    it('should return false if the token has not been revoked', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.tokens = [
        {
          tokenId: 'token_id',
          clientSecretId: 'client_secret_id',
        } as any,
      ];

      // Act
      const hasTokenBeenRevoked = client.hasTokenBeenRevoked('token_id');

      // Assert
      expect(hasTokenBeenRevoked).toBe(false);
    });
  });

  describe('updateTokenUsage', () => {
    it('should update the token usage', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.tokens = [
        {
          tokenId: 'token_id',
          usageCount: 1,
          lastUsedAt: new Date(),
        } as any,
      ];

      // Act
      client.updateTokenUsage('token_id');

      // Assert
      expect(client.tokens[0]!.usageCount).toBe(2);
      expect(client.tokens[0]!.lastUsedAt).toEqual(expect.any(Date));
    });
  });

  describe('refreshToken', () => {
    it('should throw UnauthorizedException if the token is not found', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.tokens = [];

      // Act
      const refreshToken = () => client.refreshToken('token_id');

      // Assert
      expect(refreshToken).toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if the token has been revoked', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });
      client.tokens = [
        {
          tokenId: 'token_id',
          revokedAt: new Date(),
        } as any,
      ];

      // Act
      const refreshToken = () => client.refreshToken('token_id');

      // Assert
      expect(refreshToken).toThrow(UnauthorizedException);
    });

    it('should refresh the token', () => {
      // Arrange
      const client = new Client('client_id');
      client.initialize({
        organization,
      });

      client.tokens = [
        {
          tokenId: 'token_id',
          clientSecretId: 'client_secret_id',
          issuedAt: new Date(),
          expiresAt: new Date(),
          revokedAt: undefined,
          allowedSources: ['allowed_IP'],
          roles: ['role1'],
          networkIds: ['network_id'],
        } as any,
      ];

      const token = client.refreshToken('token_id');

      expect(client.tokens[0]!.revokedAt).toEqual(expect.any(Date));
      expect(client.tokens.length).toBe(2);
      expect(token).toEqual(
        expect.objectContaining({
          roles: ['role1'],
          networkIds: ['network_id'],
          allowedSources: ['allowed_IP'],
          clientSecretId: 'client_secret_id',
          issuedAt: expect.any(Date),
          expiresAt: expect.any(Date),
        })
      );
    });
  });
});
