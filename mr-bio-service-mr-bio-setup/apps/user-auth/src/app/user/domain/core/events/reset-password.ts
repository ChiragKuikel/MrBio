import { User } from '../entities/user';
import { CreatedMfa } from '../../../../authentication/domain/abstractions/mfa-service';

export class ResetPasswordEvent {
  constructor(
    public user: User,
    public mfa: CreatedMfa
  ) {}
}
