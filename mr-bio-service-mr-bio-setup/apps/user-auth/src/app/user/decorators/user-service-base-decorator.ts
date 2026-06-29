import { User } from '../domain/core/entities/user';
import { CreateUserDto } from '../domain/dtos/create-user';
import { UpdateUserDto } from '../domain/dtos/update-user';
import { ResetPasswordDto } from '../domain/dtos/reset-password';
import { UserService } from '../domain/abstractions/user-service';
import { ChangePasswordDto } from '../domain/dtos/change-password';
import { ForgotPasswordDto } from '../domain/dtos/forgot-password';
import { ActivateAccountDto } from '../domain/dtos/activate-account';
import { UpdateMFAStatusDto } from '../domain/dtos/update-mfa-status';
import { UpdateUserStatusDto } from '../domain/dtos/update-user-status';
import { UserAssociationDetail } from '../domain/dtos/user-association-detail';
import { SendAccountActivationDto } from '../domain/dtos/send-account-activation';
import { ActiveUserQueryOptions, UserQueryOptions } from '../domain/dtos/user-query';
import { UserWithGrantedPrivileges } from '../domain/dtos/user-with-granted-privileges';
import { ServiceOption, Nullable, PaginatedResponse, CountResponse } from '@mr-bio/core/shared';

export abstract class UserServiceBaseDecorator implements UserService {
  constructor(private userService: UserService) {}

  async count(query: UserQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.userService.count(query, option);
  }

  async validateUser(id: string, option?: ServiceOption): Promise<UserWithGrantedPrivileges> {
    return await this.userService.validateUser(id, option);
  }

  async update(user: User, option?: ServiceOption): Promise<Nullable<User>> {
    return await this.userService.update(user, option);
  }

  async updateUserStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    return await this.userService.updateUserStatus(id, updateUserStatusDto, option);
  }

  async updateMFAStatus(
    id: string,
    updateMFAStatusDto: UpdateMFAStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    return await this.userService.updateMFAStatus(id, updateMFAStatusDto, option);
  }

  async getOneByEmail(identifier: string, option?: ServiceOption): Promise<User> {
    return await this.userService.getOneByEmail(identifier, option);
  }

  async getOneByIdentifier(identifier: string, option?: ServiceOption): Promise<User> {
    return await this.userService.getOneByIdentifier(identifier, option);
  }

  async findOneByIdentifier(identifier: string, option?: ServiceOption): Promise<Nullable<User>> {
    return await this.userService.findOneByIdentifier(identifier, option);
  }

  async getUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<UserAssociationDetail> {
    return await this.userService.getUserAssociationDetail(id, option);
  }

  async changePassword(
    changePasswordDto: ChangePasswordDto,
    option?: ServiceOption
  ): Promise<void> {
    return await this.userService.changePassword(changePasswordDto, option);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    option?: ServiceOption
  ): Promise<void> {
    return await this.userService.forgotPassword(forgotPasswordDto, option);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, option?: ServiceOption): Promise<void> {
    return await this.userService.resetPassword(resetPasswordDto, option);
  }

  async create(createDto: CreateUserDto, option?: ServiceOption): Promise<User> {
    return await this.userService.create(createDto, option);
  }

  async get(query: UserQueryOptions, option?: ServiceOption): Promise<PaginatedResponse<User>> {
    return await this.userService.get(query, option);
  }

  async getActiveUsers(
    query: ActiveUserQueryOptions,
    option: ServiceOption
  ): Promise<PaginatedResponse<User>> {
    return await this.userService.getActiveUsers(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<User> {
    return await this.userService.getOneById(id, option);
  }

  async updateById(id: string, updateDto: UpdateUserDto, option?: ServiceOption): Promise<User> {
    return await this.userService.updateById(id, updateDto, option);
  }

  async sendAccountActivation(
    sendAccountActivationDto: SendAccountActivationDto,
    option?: ServiceOption
  ): Promise<void> {
    return await this.userService.sendAccountActivation(sendAccountActivationDto, option);
  }

  async activateAccount(
    activateAccountDto: ActivateAccountDto,
    option?: ServiceOption
  ): Promise<void> {
    return await this.userService.activateAccount(activateAccountDto, option);
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    return await this.userService.deleteById(id, option);
  }
}
