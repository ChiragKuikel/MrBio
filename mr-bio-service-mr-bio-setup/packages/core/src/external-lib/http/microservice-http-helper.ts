import { AxiosRequestConfig } from 'axios';
import { AxiosHttpRequestHelper } from './axios-http-helper';
import {
  SERVICE_AUTHORIZATION_HEADER,
  AUTH_ENTITY_HEADER,
  IHttpRequestOptions,
  TokenHelper,
  SERVICE_TOKEN_EXPIRY_TIME_IN_MIN,
  BaseConfigService,
} from '../../shared';

export class MicroserviceHttpRequestHelper extends AxiosHttpRequestHelper {
  constructor(
    private configService: BaseConfigService,
    private tokenHelper: TokenHelper,
    private sourceService: string,
    private targetService: string
  ) {
    super();
  }

  public getConfig(options?: IHttpRequestOptions): AxiosRequestConfig<any> {
    const headers = {
      'Content-Type': 'application/json',
      // Attach authenticated user
      ...(options?.authEntity && {
        [AUTH_ENTITY_HEADER]: JSON.stringify(options?.authEntity),
      }),
      // Attach service token
      [SERVICE_AUTHORIZATION_HEADER]: this.generateServiceJwt(),
    };

    if (options) {
      options.headers = { ...options.headers, ...headers };
    } else {
      options = { headers };
    }

    return options;
  }

  private generateServiceJwt(): string {
    const serviceToken = this.tokenHelper.generate(
      {
        sub: this.sourceService,
        aud: this.targetService,
      },
      this.configService.app.serviceJwtSecret,
      SERVICE_TOKEN_EXPIRY_TIME_IN_MIN
    );

    return `Bearer ${serviceToken}`;
  }
}
