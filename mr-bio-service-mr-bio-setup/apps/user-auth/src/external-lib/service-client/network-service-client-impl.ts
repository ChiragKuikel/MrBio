import { Injectable } from '@nestjs/common';
import { SERVICE_NAME } from '../../shared/constants';
import { IServiceUrlConfig } from '../../config/type';
import { MicroserviceHttpRequestHelper } from '@mr-bio/core/external-lib';
import { NetworkServiceClient } from '../../shared/abstractions/network-service-client';
import { UserAuthConfigService } from '../../shared/abstractions/user-auth-config-service';
import {
  Network,
  Organization,
} from '../../shared/service-client-responses/service-client-network';
import {
  HttpRequestHelper,
  serviceNameConstants,
  ServiceOption,
  TokenHelper,
} from '@mr-bio/core/shared';

@Injectable()
export class NetworkServiceClientImpl implements NetworkServiceClient {
  private serviceUrlConfig: IServiceUrlConfig;
  private httpRequestHelper: HttpRequestHelper;

  constructor(configService: UserAuthConfigService, tokenHelper: TokenHelper) {
    this.serviceUrlConfig = configService.serviceUrl;

    this.httpRequestHelper = new MicroserviceHttpRequestHelper(
      configService,
      tokenHelper,
      SERVICE_NAME,
      serviceNameConstants.NETWORK
    );
    this.httpRequestHelper.init(this.serviceUrlConfig.network);
  }

  async getOrganizationById(id: string, option?: ServiceOption): Promise<Organization> {
    return await this.httpRequestHelper.get(`/organizations/${id}`, {
      authEntity: option?.authEntity,
    });
  }

  async getNetworkById(id: string, option?: ServiceOption): Promise<Network> {
    return await this.httpRequestHelper.get(`/networks/${id}`, {
      authEntity: option?.authEntity,
    });
  }
}
