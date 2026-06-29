import { Global, Module } from '@nestjs/common';
import { BaseConfigService } from '@mr-bio/core/shared';
import { ConfigService } from '../../config/config-service';
import { ActivityLogConfigService } from '../../shared/abstractions/activity-log-config-service';

@Global()
@Module({
  exports: [ActivityLogConfigService, BaseConfigService],
  providers: [
    {
      useClass: ConfigService,
      provide: ActivityLogConfigService,
    },
    {
      useClass: ConfigService,
      provide: BaseConfigService,
    },
  ],
})
export class ConfigModule {}
