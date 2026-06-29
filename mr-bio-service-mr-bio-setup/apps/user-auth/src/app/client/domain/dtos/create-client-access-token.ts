export type CreateClientAccessTokenDto = {
  clientSecret: string;
  roles: string[];
  networkIds?: string[];
};

export type ClientAuthTokens = {
  tokenId: string;
  accessToken: string;
  refreshToken: string;
};
