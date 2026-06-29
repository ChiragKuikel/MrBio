import { IEmailClientConfig } from './type';
import { Injectable } from '@nestjs/common';
import { SERVICE_NAME } from '../shared/constants';
import { IEnvConfig, configSchema } from './validation/env';
import { BaseConfigService, IAppConfig, IDbConfig, IKafkaConfig } from '@mr-bio/core/shared';
import { CommunicationConfigService } from '../shared/abstractions/communication-config-service';

@Injectable()
export class ConfigService
  extends BaseConfigService<IEnvConfig>
  implements CommunicationConfigService
{
  constructor() {
    super(configSchema);
  }

  get sendGrid(): IEmailClientConfig {
    return {
      key: this.envData.SENDGRID_KEY,
      senderName: this.envData.SENDGRID_SENDER_NAME,
      senderEmail: this.envData.SENDGRID_SENDER_EMAIL,
    };
  }

  get app(): IAppConfig {
    return {
      env: this.envData.ENV,
      isDebug: this.envData.DEBUG,
      serviceName: SERVICE_NAME,
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

  // get kafka(): IKafkaConfig {
  //   return {
  //     brokers: this.envData.KAFKA_BROKERS.split(','),
  //   };
  // }
}
