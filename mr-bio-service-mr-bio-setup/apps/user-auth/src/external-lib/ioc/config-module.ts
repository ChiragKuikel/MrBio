import { Global, Module } from '@nestjs/common';
import { BaseConfigService } from '@mr-bio/core/shared';
import { ConfigService } from '../../config/config-service';
import { UserAuthConfigService } from '../../shared/abstractions/user-auth-config-service';

@Global()
@Module({
  exports: [UserAuthConfigService, BaseConfigService],
  providers: [
    {
      useClass: ConfigService,
      provide: UserAuthConfigService,
    },
    {
      useClass: ConfigService,
      provide: BaseConfigService,
    },
  ],
})
export class ConfigModule {}
