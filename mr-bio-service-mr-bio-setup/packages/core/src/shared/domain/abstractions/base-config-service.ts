import { exit } from 'process';
import { AnyZodObject } from 'zod';
import * as dotenv from '@dotenvx/dotenvx';
import { validateConfig } from '../../validator/validate-config';
import {
  DomainException,
  IAppConfig,
  IDbConfig,
  IDbEncryptionConfig,
  IKafkaConfig,
  IRedisConfig,
  IStorageConfig,
  coreErrorMessage,
} from '../';

export abstract class BaseConfigService<T = any> {
  private _envData: T | null = null;

  constructor(configSchema: AnyZodObject) {
    this._envData = validateConfig<T>(this._parsedEnv, configSchema);
  }
  abstract get app(): IAppConfig;

  get mongoDb(): IDbConfig {
    throw new DomainException(coreErrorMessage.DEFAULT_ERROR, 'MongoDb config not initialized');
  }

  get mongoDbEncryption(): IDbEncryptionConfig {
    throw new DomainException(
      coreErrorMessage.DEFAULT_ERROR,
      'MongoDb encryption config not initialized'
    );
  }

  get kafka(): IKafkaConfig {
    throw new DomainException(coreErrorMessage.DEFAULT_ERROR, 'Kafka config not initialized');
  }

  get s3(): IStorageConfig {
    throw new DomainException(coreErrorMessage.DEFAULT_ERROR, 'S3 config not initialized');
  }

  get redis(): IRedisConfig {
    throw new DomainException(coreErrorMessage.DEFAULT_ERROR, 'Redis cache not initialized');
  }

  get envData(): T {
    if (this._envData == null) {
      // eslint-disable-next-line no-console
      console.log(coreErrorMessage.DEFAULT_ERROR, 'Config service has not been initialized.');
      exit(1);
    }

    return this._envData!;
  }

  private get _parsedEnv() {
    return { ...dotenv.config().parsed };
  }
}
