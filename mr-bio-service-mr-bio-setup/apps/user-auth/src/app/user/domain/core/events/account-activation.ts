import { User } from '../entities/user';
import { CreatedMfa } from '../../../../authentication/domain/abstractions/mfa-service';

export class AccountActivationEvent {
  constructor(
    public user: User,
    public mfa: CreatedMfa
  ) {}
}
