import { IEnvConfig } from '../validations/env';
import { BaseConfigService } from '@mr-bio/core/shared';
import { IAuthConfig, IServiceUrlConfig } from '../../config/type';

export abstract class UserAuthConfigService extends BaseConfigService<IEnvConfig> {
  abstract get auth(): IAuthConfig;
  abstract get serviceUrl(): IServiceUrlConfig;
}
