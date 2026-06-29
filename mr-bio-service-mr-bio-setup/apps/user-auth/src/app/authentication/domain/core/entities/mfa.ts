import {
  BaseEntity,
  DateUnit,
  DomainException,
  addDate,
  checkIfDateIsExpired,
  generateOTP,
  getCurrentUTCDate,
} from '@mr-bio/core/shared';
import {
  ACCOUNT_ACTIVATION_TOKEN_VALIDITY_MIN,
  LOGIN_TOKEN_VALIDITY_MIN,
  RESET_PASSWORD_TOKEN_VALIDITY_MIN,
} from '../../../../../shared/constants';

export enum MfaType {
  ONE_TIME_PASSWORD = 'one_time_password',
  ONE_TIME_LINK = 'one_time_link',
  NO_AUTH = 'no_auth',
}

export enum MfaAction {
  LOGIN = 'login',
  RESET_PASSWORD = 'reset_password',
  ACCOUNT_ACTIVATION = 'account_activation',
}

export class Mfa extends BaseEntity {
  code: string;
  expirationTime: Date;
  isUsed: boolean;
  isVerified: boolean;
  type: MfaType;
  action: MfaAction;

  get hasExpired(): boolean {
    return this.isUsed || checkIfDateIsExpired(this.expirationTime);
  }

  get validityInMinutes(): number {
    switch (this.action) {
      case MfaAction.LOGIN:
        return LOGIN_TOKEN_VALIDITY_MIN;
      case MfaAction.ACCOUNT_ACTIVATION:
        return ACCOUNT_ACTIVATION_TOKEN_VALIDITY_MIN;
      case MfaAction.RESET_PASSWORD:
        return RESET_PASSWORD_TOKEN_VALIDITY_MIN;
      default:
        throw new DomainException('Invalid MFA action');
    }
  }

  get isOneTimePassword(): boolean {
    return this.type === MfaType.ONE_TIME_PASSWORD;
  }

  get isOneTimeLink(): boolean {
    return this.type === MfaType.ONE_TIME_LINK;
  }

  get isNoAuth(): boolean {
    return this.type === MfaType.NO_AUTH;
  }

  initialize(builder: { type: MfaType; action: MfaAction }) {
    this.type = builder.type;
    this.action = builder.action;
    this.code = builder.type === MfaType.ONE_TIME_PASSWORD ? generateOTP(4) : '';
    this.expirationTime = addDate(getCurrentUTCDate(), this.validityInMinutes, DateUnit.MINUTES);
    this.isUsed = false;
    this.isVerified = false;

    if (this.isNoAuth) {
      this.isVerified = true;
    }
  }
}
