import { Global, Module } from '@nestjs/common';
import { BaseConfigService } from '@mr-bio/core/shared';
import { ConfigService } from '../../config/config-service';
import { ProductConfigService } from '../../shared/abstractions/product-config-service';

@Global()
@Module({
  exports: [ProductConfigService, BaseConfigService],
  providers: [
    {
      useClass: ConfigService,
      provide: ProductConfigService,
    },
    {
      useClass: ConfigService,
      provide: BaseConfigService,
    },
  ],
})
export class ConfigModule {}
