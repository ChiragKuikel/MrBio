export interface IAuthConfig {
  defaultUserPassword: string;
  authTokenSecret: string;
  mfaTokenKey: string;
}
export interface IServiceUrlConfig {
  ui: string;
  network: string;
}
