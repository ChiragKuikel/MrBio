export type RevokeClientSecretDto = {
  clientSecret: string;
};

export type RevokedClientSecret = {
  clientId: string;
  clientSecretId: string;
  name: string;
};
