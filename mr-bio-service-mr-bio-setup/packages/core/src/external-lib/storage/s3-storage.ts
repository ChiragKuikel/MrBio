import { Injectable } from '@nestjs/common';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { BaseConfigService, Storage } from '../../shared/domain/abstractions';
import { AnyObj, IStorageConfig, S3_UPLOAD_PRESIGNED_URL_EXPIRY } from '../../shared';

@Injectable()
export class S3Storage implements Storage {
  private client: S3Client;
  private s3Config: IStorageConfig;

  constructor(configService: BaseConfigService) {
    this.s3Config = configService.s3;
    this.client = new S3Client({
      region: this.s3Config.region,
      credentials: {
        accessKeyId: this.s3Config.accessKeyId,
        secretAccessKey: this.s3Config.secretAccessKey,
      },
    });
  }

  async generateUploadPresignedUrl(
    key: string,
    contentType?: string,
    metadata?: AnyObj<string>
  ): Promise<string> {
    const command = new PutObjectCommand({
      Key: key,
      Metadata: metadata,
      ContentType: contentType,
      Bucket: this.s3Config.bucketName,
    });
    const url = await getSignedUrl(this.client, command, {
      expiresIn: S3_UPLOAD_PRESIGNED_URL_EXPIRY,
    });

    return url;
  }

  generateUrl(key: string): string {
    return `${this.s3Config.bucketUrl}/${key}`;
  }
}
