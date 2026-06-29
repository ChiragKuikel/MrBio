import { HashedValue } from '../../../../../shared/value-objects/hashed-value';
import { ACCESS_TOKEN_EXPIRY_TIME_IN_MIN, errorMessage } from '../../../../../shared/constants';
import {
  Assigner,
  BaseEntity,
  getCurrentUTCDate,
  generateRandomKey,
  getUUID,
  IContact,
  Maybe,
  OrganizationReference,
  addDate,
  DateUnit,
  UnauthorizedException,
} from '@mr-bio/core/shared';

export class Client extends BaseEntity {
  clientSecrets: ClientSecret[];
  organization: {
    id: string;
    code: string;
    name: string;
  };
  tokens: ClientToken[];
  contacts?: IContact[];

  initialize(builder: ClientBuilder) {
    this.contacts = builder.contacts;
    this.organization = builder.organization;
    this.clientSecrets = [];
    this.tokens = [];
  }

  createClientSecret(input: CreateClientSecretInput): ClientSecret & { plainSecret: string } {
    const plainSecret = this._generateClientSecret();

    const newClientSecret = {
      clientSecretId: getUUID(),
      name: input.name,
      value: HashedValue.fromValue(plainSecret),
      allowedSources: input.allowedSources,
      created: input.created,
    };
    this.clientSecrets.push(newClientSecret);

    return { ...newClientSecret, plainSecret };
  }

  createToken(input: CreateClientTokenInput): ClientToken {
    const { clientSecret, roles, networkIds } = input;
    const clientSecretToBeUsed = this.findClientSecret(clientSecret);

    if (!clientSecretToBeUsed || clientSecretToBeUsed.revoked)
      throw new UnauthorizedException(errorMessage.INVALID_CLIENT_SECRET);

    const tokenId = getUUID();

    const token = {
      tokenId,
      clientSecretId: clientSecretToBeUsed.clientSecretId,
      issuedAt: getCurrentUTCDate(),
      expiresAt: addDate(getCurrentUTCDate(), ACCESS_TOKEN_EXPIRY_TIME_IN_MIN, DateUnit.MINUTES),
      allowedSources: clientSecretToBeUsed.allowedSources,
      roles,
      networkIds,
    };

    this.tokens.push(token);

    clientSecretToBeUsed.lastUsedAt = getCurrentUTCDate();
    clientSecretToBeUsed.usageCount = (clientSecretToBeUsed.usageCount ?? 0) + 1;

    return token;
  }

  refreshToken(existingTokenId: string): ClientToken {
    const existingToken = this.findToken(existingTokenId);
    if (!existingToken || existingToken.revokedAt) throw new UnauthorizedException();

    existingToken.revokedAt = getCurrentUTCDate();

    const tokenId = getUUID();

    const token: ClientToken = {
      tokenId,
      clientSecretId: existingToken.clientSecretId,
      issuedAt: getCurrentUTCDate(),
      expiresAt: addDate(getCurrentUTCDate(), ACCESS_TOKEN_EXPIRY_TIME_IN_MIN, DateUnit.MINUTES),
      allowedSources: existingToken.allowedSources,
      roles: existingToken.roles,
      networkIds: existingToken.networkIds,
    };

    this.tokens.push(token);

    return token;
  }

  findClientSecret(clientSecret: string): Maybe<ClientSecret> {
    return this.clientSecrets.find(secret => secret.value.compare(clientSecret));
  }

  findClientSecretById(id: string): Maybe<ClientSecret> {
    return this.clientSecrets.find(secret => secret.clientSecretId === id);
  }

  findToken(tokenId: string): Maybe<ClientToken> {
    return this.tokens.find(token => token.tokenId === tokenId);
  }

  revokeClientSecret(input: RevokeClientSecretInput): ClientSecret {
    const clientSecretToBeRevoked = this.findClientSecret(input.clientSecret);

    if (!clientSecretToBeRevoked || clientSecretToBeRevoked.revoked)
      throw new UnauthorizedException(errorMessage.INVALID_CLIENT_SECRET);

    clientSecretToBeRevoked.revoked = input.revoked;

    for (const token of this.tokens) {
      if (token.clientSecretId === clientSecretToBeRevoked.clientSecretId && !token.revokedAt) {
        token.revokedAt = getCurrentUTCDate();
      }
    }

    return clientSecretToBeRevoked;
  }

  hasTokenBeenRevoked(tokenId: string): boolean {
    const token = this.tokens.find(token => token.tokenId === tokenId);

    return token ? !!token.revokedAt : false;
  }

  updateTokenUsage(tokenId: string): void {
    const token = this.tokens.find(token => token.tokenId === tokenId);
    if (!token) return;

    token.usageCount = (token.usageCount ?? 0) + 1;
    token.lastUsedAt = getCurrentUTCDate();
  }

  _generateClientSecret(): string {
    return generateRandomKey(32);
  }
}

export type ClientSecret = {
  clientSecretId: string;
  name: string;
  value: HashedValue;
  allowedSources: string[];
  lastUsedAt?: Date;
  usageCount?: number;
  created: Assigner;
  updated?: Assigner;
  revoked?: Assigner;
};

export type ClientToken = {
  tokenId: string;
  clientSecretId: string;
  allowedSources: string[];
  roles: string[];
  networkIds?: string[];
  issuedAt: Date;
  expiresAt: Date;
  lastUsedAt?: Date;
  revokedAt?: Date;
  usageCount?: number;
};

export type ClientBuilder = {
  contacts?: IContact[];
  organization: OrganizationReference;
};

export type CreateClientSecretInput = {
  name: string;
  allowedSources: string[];
  created: Assigner;
};

export type RevokeClientSecretInput = {
  clientSecret: string;
  revoked: Assigner;
};

export type CreateClientTokenInput = {
  clientSecret: string;
  roles: string[];
  networkIds?: string[];
};
