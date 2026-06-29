export interface IDbConfig {
  protocol: string;
  username: string;
  password: string;
  port?: number;
  host: string;
  dbName: string;
}

export interface IDbEncryptionConfig {
  aws: {
    accessKey: string;
    secretKey: string;
    keyArn: string;
    region: string;
  };
  vault: {
    collectionName: string;
    dataKeyName: string;
    sharedLibPath?: string; // Path to your Automatic Encryption Shared Library
  };
}

export interface IAppConfig {
  port: number;
  env: string;
  serviceName: string;
  isDebug?: boolean;
  corsWhitelist?: string[];
  serviceJwtSecret: string;
  swaggerApiBaseUrl?: string;
  userServiceUrl: string;
}

export interface IStorageConfig {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  bucketUrl: string;
}

export interface IKafkaConfig {
  brokers: string[];
}

export interface IRedisConfig {
  port: number;
  host: string;
  username: string;
  password: string;
}

export interface IConfig {
  app: IAppConfig;
  mongoDb?: IDbConfig;
  mongoDbEncryption?: IDbEncryptionConfig;
  s3?: IStorageConfig;
}
