import { Global, Module } from '@nestjs/common';
import { BaseConfigService } from '@mr-bio/core/shared';
import { ConfigService } from '../../config/config-service';
import { CommunicationConfigService } from '../../shared/abstractions/communication-config-service';

@Global()
@Module({
  exports: [CommunicationConfigService, BaseConfigService],
  providers: [
    {
      useClass: ConfigService,
      provide: CommunicationConfigService,
    },
    {
      useClass: ConfigService,
      provide: BaseConfigService,
    },
  ],
})
export class ConfigModule {}
