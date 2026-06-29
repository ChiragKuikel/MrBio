import { Injectable } from '@nestjs/common';
import { SERVICE_NAME } from '../shared/constants';
import { IEnvConfig, configSchema } from './validation/env';
import { BaseConfigService, IAppConfig, IDbConfig } from '@mr-bio/core/shared';
import { ProductConfigService } from '../shared/abstractions/product-config-service';

@Injectable()
export class ConfigService extends BaseConfigService<IEnvConfig> implements ProductConfigService {
  constructor() {
    super(configSchema);
  }

  get app(): IAppConfig {
    return {
      env: this.envData.ENV,
      serviceName: SERVICE_NAME,
      isDebug: this.envData.DEBUG,
      port: this.envData.SERVER_PORT,
      serviceJwtSecret: this.envData.SERVICE_JWT_SECRET,
      swaggerApiBaseUrl: this.envData.SWAGGER_API_BASE_URL,
      userServiceUrl: this.envData.USER_AUTH_BASE_URL,
    };
  }

  get mongoDb(): IDbConfig {
    return {
      port: this.envData.MONGO_DB_PORT,
      dbName: this.envData.MONGO_DB_NAME,
      username: this.envData.MONGO_USERNAME,
      password: this.envData.MONGO_PASSWORD,
      host: this.envData.MONGO_CLUSTER_NAME,
      protocol: this.envData.MONGO_DB_PROTOCOL,
    };
  }
}
