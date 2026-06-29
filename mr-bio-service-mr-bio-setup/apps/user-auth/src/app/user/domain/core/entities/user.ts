import { errorMessage } from '../../../../../shared/constants';
import { UserPasswordException } from '../exceptions/user-password-exception';
import { HashedValue } from '../../../../../shared/value-objects/hashed-value';
import { AssociatedResource } from '../../../../../shared/types/associated-resource';
import { InvalidCredentialException } from '../../../../../shared/exception/invalid-credentials-exception';
import {
  Assigner,
  BaseEntity,
  Gender,
  IAddress,
  IPhone,
  NetworkReference,
  OrganizationReference,
  PhoneType,
  generateUsername,
  getCurrentUTCDate,
  getFullName,
} from '@mr-bio/core/shared';

export class User extends BaseEntity {
  username: string;
  email: string;
  phones?: IPhone[];
  firstName: string;
  middleName?: string;
  lastName: string;
  dob?: string;
  gender: Gender;
  password: HashedValue;
  passwordHistory?: HashedValue[];
  loginAttempts?: number;
  lastLoginDate?: Date;
  enableMFA: boolean;
  status: UserStatus;
  address?: IAddress;
  association: UserAssociation;
  // organization: OrganizationReference;
  // networks?: UserNetwork[];

  initialize(builder: {
    email: string;
    phones?: IPhone[];
    firstName: string;
    middleName?: string;
    lastName: string;
    dob?: string;
    gender: Gender;
    address?: IAddress;
    password: string;
    // organization: OrganizationReference;
    association: UserAssociation;
  }) {
    this.email = builder.email;
    this.phones = builder.phones;
    this.firstName = this._trimValue(builder.firstName);
    this.dob = builder.dob;
    if (builder.middleName) {
      this.middleName = this._trimValue(builder.middleName);
    }
    this.lastName = this._trimValue(builder.lastName);
    this.gender = builder.gender;
    this.address = builder.address;
    this.enableMFA = false;
    this.status = UserStatus.ACTIVE;
    if (builder.password) {
      this.password = HashedValue.fromValue(builder.password);
    }
    this.username = generateUsername(builder.firstName, builder.lastName, builder.dob);
    // this.organization = builder.organization;
    this.association = builder.association;
  }

  get getFullName(): string {
    return getFullName({
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
    });
  }

  get isActive(): boolean {
    return this.status === UserStatus.ACTIVE;
  }

  get needMFA(): boolean {
    return this.enableMFA;
  }

  get cellPhone() {
    return this.phones?.find(phone => phone.type === PhoneType.CELL);
  }

  get homePhone() {
    return this.phones?.find(phone => phone.type === PhoneType.CELL);
  }

  get workPhone() {
    return this.phones?.find(phone => phone.type === PhoneType.CELL);
  }

  // getOrganization() {
  //   return this.organization;
  // }

  // getActiveNetworks() {
  //   return this.networks?.filter(network => network.status === UserNetworkStatus.ACTIVE) || [];
  // }

  // getIsActiveNetwork(networkId: string): boolean {
  //   return !!this.networks?.some(
  //     network => network.id === networkId && network.status === UserNetworkStatus.ACTIVE
  //   );
  // }

  activate(password: string): void {
    this.status = UserStatus.ACTIVE;
    this.password = HashedValue.fromValue(password);
  }

  login(password: string): void {
    if (this.password && this.password.compare(password)) {
      return;
    }

    this._failedLogin();
    throw new InvalidCredentialException();
  }

  finishLoginProcess(): void {
    this.loginAttempts = 0;
    this.lastLoginDate = getCurrentUTCDate();
  }

  initiateActivation() {
    this.status = UserStatus.PENDING_ACTIVATION;
  }

  disable() {
    this.status = UserStatus.INACTIVE;
  }

  logout(): void {
    this.loginAttempts = 0;
  }

  changePassword(oldPassword: string, newPassword: string): void {
    if (!this.password) {
      throw new UserPasswordException(errorMessage.PASSWORD_NOT_SET);
    }

    if (!this.password.compare(oldPassword)) {
      throw new InvalidCredentialException(errorMessage.PASSWORD_NOT_MATCHED);
    }

    this.updatePassword(newPassword);
  }

  updatePassword(newPassword: string): void {
    this._validatePasswordUpdate(newPassword);
    if (this.passwordHistory) {
      this.passwordHistory.push(this.password!);
    } else {
      this.passwordHistory = [this.password!];
    }
    this.password = HashedValue.fromValue(newPassword);
  }

  // assignNetworkToUser(network: NetworkReference, updatedBy: Assigner) {
  //   // Insert if no networks is assigned initially
  //   if (!this.networks || !this.networks.length) {
  //     this.networks = [
  //       {
  //         ...network,
  //         status: UserNetworkStatus.ACTIVE,
  //         created: updatedBy,
  //         updated: updatedBy,
  //       },
  //     ];

  //     return;
  //   }

  // Change the status to 'ACTIVE' if the network is in 'INACTIVE' status
  //   if (this.networks.find(net => net.id === network.id)) {
  //     this.networks = this.networks.map(net => {
  //       if (net.id === network.id && net.status === UserNetworkStatus.INACTIVE) {
  //         return { ...net, status: UserNetworkStatus.ACTIVE, updated: updatedBy };
  //       }

  //       return net;
  //     });

  //     return;
  //   }

  //   // Append the new network if it is not in the user's networks
  //   this.networks = [
  //     ...this.networks,
  //     { ...network, status: UserNetworkStatus.ACTIVE, created: updatedBy, updated: updatedBy },
  //   ];
  // }

  // unassignNetworkFromUser(networkId: string, updatedBy: Assigner) {
  //   if (!this.networks || !this.networks?.length) {
  //     return;
  //   }

  //   this.networks = this.networks.map(network => {
  //     if (network.id === networkId) {
  //       return { ...network, status: UserNetworkStatus.INACTIVE, updatedBy };
  //     }

  //     return network;
  //   });
  // }

  private _trimValue(value: string) {
    if (!value) return '';

    return value.trim();
  }

  private _failedLogin(): void {
    if (this.loginAttempts) {
      this.loginAttempts++;
    } else {
      this.loginAttempts = 1;
    }
  }

  private _validatePasswordUpdate(newPassword: string): void {
    if (!this.password) {
      throw new UserPasswordException(errorMessage.PASSWORD_NOT_SET);
    }
    // Validate current password
    if (this.password.compare(newPassword)) {
      throw new UserPasswordException(errorMessage.PASSWORD_HISTORY_ERROR);
    }

    // Validate password history
    if (this.passwordHistory) {
      this.passwordHistory.slice(-3).forEach(oldPassword => {
        if (oldPassword.compare(newPassword)) {
          throw new UserPasswordException(
            'You cannot use your previous passwords as the new password.'
          );
        }
      });
    }
  }
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING_ACTIVATION = 'pending_activation',
}

export type UserAssociation = {
  roles?: string[]; // stores codes
  resources?: AssociatedResource[];
};

export enum UserNetworkStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export type UserNetwork = {
  id: string;
  name: string;
  code: string;
  status: UserNetworkStatus;
  created: Assigner;
  updated: Assigner;
};

export type UserNetworkReference = Pick<UserNetwork, 'id' | 'code' | 'name'>;
