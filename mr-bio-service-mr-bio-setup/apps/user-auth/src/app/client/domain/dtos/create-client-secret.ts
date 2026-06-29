export type CreateClientSecretDto = {
  name: string;
  allowedSources: string[];
};

export type CreatedClientSecret = {
  clientId: string;
  clientSecretId: string;
  clientSecret: string;
  name: string;
  allowedSources: string[];
};
