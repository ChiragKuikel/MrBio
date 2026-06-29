import { Injectable } from '@nestjs/common';
import { SERVICE_NAME } from '../shared/constants';
import { IAuthConfig, IServiceUrlConfig } from './type';
import { configSchema } from '../shared/validations/env';
import { UserAuthConfigService } from '../shared/abstractions/user-auth-config-service';
import { IAppConfig, IDbConfig, IKafkaConfig, IRedisConfig } from '@mr-bio/core/shared';

@Injectable()
export class ConfigService extends UserAuthConfigService {
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

  get auth(): IAuthConfig {
    return {
      defaultUserPassword: this.envData.DEFAULT_USER_PASSWORD,
      authTokenSecret: this.envData.AUTH_TOKEN_SECRET,
      mfaTokenKey: this.envData.MFA_TOKEN_KEY,
    };
  }

  get serviceUrl(): IServiceUrlConfig {
    return {
      ui: this.envData.UI_BASE_URL,
      network: this.envData.USER_AUTH_BASE_URL,
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

  // get kafka(): IKafkaConfig {
  //   return {
  //     brokers: this.envData.KAFKA_BROKERS.split(','),
  //   };
  // }

  // get redis(): IRedisConfig {
  //   return {
  //     port: this.envData.REDIS_PORT,
  //     host: this.envData.REDIS_HOST,
  //     username: this.envData.REDIS_USERNAME,
  //     password: this.envData.REDIS_PASSWORD,
  //   };
  // }
}
