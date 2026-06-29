import { User } from '../core/entities/user';
import { CreateUserDto } from '../dtos/create-user';
import { UpdateUserDto } from '../dtos/update-user';
import { ResetPasswordDto } from '../dtos/reset-password';
import { ChangePasswordDto } from '../dtos/change-password';
import { ForgotPasswordDto } from '../dtos/forgot-password';
import { ActivateAccountDto } from '../dtos/activate-account';
import { UpdateMFAStatusDto } from '../dtos/update-mfa-status';
import { UpdateUserStatusDto } from '../dtos/update-user-status';
import { UserAssociationDetail } from '../dtos/user-association-detail';
import { SendAccountActivationDto } from '../dtos/send-account-activation';
import { ActiveUserQueryOptions, UserQueryOptions } from '../dtos/user-query';
import { UserWithGrantedPrivileges } from '../dtos/user-with-granted-privileges';
import {
  BaseService,
  Nullable,
  FindAllResponse,
  ServiceOption,
  PaginatedResponse,
} from '@mr-bio/core/shared';

export abstract class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserQueryOptions
> {
  abstract getActiveUsers(
    query: ActiveUserQueryOptions,
    option: ServiceOption
  ): Promise<PaginatedResponse<User>>;

  abstract validateUser(id: string, option?: ServiceOption): Promise<UserWithGrantedPrivileges>;

  abstract update(user: User, option?: ServiceOption): Promise<Nullable<User>>;
  abstract updateUserStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
    option?: ServiceOption
  ): Promise<User>;
  abstract updateMFAStatus(
    id: string,
    updateMFAStatusDto: UpdateMFAStatusDto,
    option?: ServiceOption
  ): Promise<User>;

  abstract getOneByEmail(email: string, option?: ServiceOption): Promise<User>;
  abstract getOneByIdentifier(identifier: string, option?: ServiceOption): Promise<User>;
  abstract getUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<UserAssociationDetail>;

  abstract findOneByIdentifier(identifier: string, option?: ServiceOption): Promise<Nullable<User>>;

  abstract changePassword(
    changePasswordDto: ChangePasswordDto,
    option?: ServiceOption
  ): Promise<void>;
  abstract forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    option?: ServiceOption
  ): Promise<void>;
  abstract resetPassword(resetPasswordDto: ResetPasswordDto, option?: ServiceOption): Promise<void>;

  abstract sendAccountActivation(
    sendAccountActivationDto: SendAccountActivationDto,
    option?: ServiceOption
  ): Promise<void>;
  abstract activateAccount(
    activateAccountDto: ActivateAccountDto,
    option?: ServiceOption
  ): Promise<void>;
}
