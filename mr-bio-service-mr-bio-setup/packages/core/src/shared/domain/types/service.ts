import { ProjectModule } from '../enum';
import { AuthEntity } from './auth-user';
import { DbSession } from '../abstractions/unit-of-work';

export type ServiceOption = {
  authEntity?: AuthEntity;
  session?: DbSession;
  sourceModule?: ProjectModule;
};
