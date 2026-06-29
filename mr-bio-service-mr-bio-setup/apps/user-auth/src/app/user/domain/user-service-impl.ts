import { CreateUserDto } from './dtos/create-user';
import { UpdateUserDto } from './dtos/update-user';
import { MfaUser } from './core/entities/mfa-user';
import { User, UserStatus } from './core/entities/user';
import { ResetPasswordDto } from './dtos/reset-password';
import { errorMessage } from '../../../shared/constants';
import { UserService } from './abstractions/user-service';
import { ChangePasswordDto } from './dtos/change-password';
import { ForgotPasswordDto } from './dtos/forgot-password';
import { ActivateAccountDto } from './dtos/activate-account';
import { UpdateMFAStatusDto } from './dtos/update-mfa-status';
import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { UpdateUserStatusDto } from './dtos/update-user-status';
import { ResetPasswordEvent } from './core/events/reset-password';
import { UserAssociationDetail } from './dtos/user-association-detail';
import { SendAccountActivationDto } from './dtos/send-account-activation';
import { AccountActivationEvent } from './core/events/account-activation';
import { UserRepository } from '../repository/abstractions/user-repository';
import { ActiveUserQueryOptions, UserQueryOptions } from './dtos/user-query';
import { UserPrivilegesService } from './abstractions/user-privileges-service';
import { UserWithGrantedPrivileges } from './dtos/user-with-granted-privileges';
import { MfaService } from '../../authentication/domain/abstractions/mfa-service';
import { RoleService } from '../../authorization/domain/abstractions/role-service';
import { MfaAction, MfaType } from '../../authentication/domain/core/entities/mfa';
import { UserMessagePublisher } from '../messaging/abstractions/user-message-publisher';
import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';
import { SessionRepository } from '../../authentication/repository/abstractions/session-repository';
import {
  FindAllResponse,
  NotFoundException,
  Nullable,
  ServiceOption,
  ConflictException,
  UnauthorizedException,
  coreErrorMessage,
  extractAuthUserId,
  formatModuleMessage,
  CountResponse,
  ProjectModule,
  BadRequestException,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(
    private mfaService: MfaService,
    private userRepository: UserRepository,
    private sessionRepository: SessionRepository,
    @Inject(forwardRef(() => UserPrivilegesService))
    private userPrivilegesService: UserPrivilegesService,
    @Inject(forwardRef(() => RoleService))
    private roleService: RoleService,
    private userMessagePublisher: UserMessagePublisher,
    private networkServiceClient: NetworkServiceClient
  ) {}

  async validateUser(id: string, option?: ServiceOption): Promise<UserWithGrantedPrivileges> {
    const user = await this.getOneById(id, option);

    if (!user.isActive) {
      throw new UnauthorizedException();
    }

    const grantedUserPrivileges = await this.userPrivilegesService.getUserGrantedPrivileges(
      id,
      option
    );

    return {
      ...user,
      fullName: user.getFullName,
      grantedPrivileges: grantedUserPrivileges,
      // networkIds: user.getActiveNetworks().map(n => n.id),
      // organizationId: user.organization.id,
      // organizationName: user.organization.name,
    };
  }

  async create(createDto: CreateUserDto, option: ServiceOption): Promise<User> {
    const existingUser = await this.userRepository.findOneByIdentifier(createDto.email, option);
    if (existingUser) throw new ConflictException(errorMessage.USER_ALREADY_EXISTS);

    // const organization = await this.networkServiceClient.getOrganizationById(
    //   createDto.organizationId,
    //   option
    // );

    const rolePromises = createDto.roleCodes.map(code => this.roleService.getOneByCode(code));
    const roles = await Promise.all(rolePromises);

    const user = new User();
    user.initialize({
      ...createDto,
      // organization: {
      //   id: organization.id,
      //   code: organization.code,
      //   name: organization.name,
      // },
      association: {
        roles: roles.map(role => role.code),
        resources: [],
      },
    });

    const createdUser = await this.userRepository.create(user, option);

    return createdUser;
  }

  //#region Get
  async count(query: UserQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.userRepository.count(query, option);
  }

  async get(query: UserQueryOptions, option: ServiceOption): Promise<PaginatedResponse<User>> {
    return await this.userRepository.findAll(query, option);
  }

  async getActiveUsers(
    query: ActiveUserQueryOptions,
    option: ServiceOption
  ): Promise<PaginatedResponse<User>> {
    return await this.userRepository.findAll({ ...query, status: UserStatus.ACTIVE }, option);
  }

  async getOneByEmail(email: string, option?: ServiceOption | undefined): Promise<User> {
    const user = await this.userRepository.findOneByEmail(email, option);
    if (!user)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return user;
  }

  async getOneByIdentifier(identifier: string, option?: ServiceOption): Promise<User> {
    const user = await this.userRepository.findOneByIdentifier(identifier, option);
    if (!user)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return user;
  }

  async getOneById(id: string, option?: ServiceOption): Promise<User> {
    const user = await this.userRepository.findOneById(id, option);
    if (!user)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return user;
  }

  async getUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<UserAssociationDetail> {
    const userAssociationDetail = await this.userRepository.findUserAssociationDetail(id, option);
    if (!userAssociationDetail)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return userAssociationDetail;
  }

  //#endregion

  //#region Find
  async findOneByIdentifier(identifier: string, option?: ServiceOption): Promise<Nullable<User>> {
    return await this.userRepository.findOneByIdentifier(identifier, option);
  }
  //#endregion

  //#region Update
  async update(user: User, option?: ServiceOption): Promise<Nullable<User>> {
    return await this.userRepository.update(user, option);
  }

  async updateById(id: string, updateDto: UpdateUserDto, option: ServiceOption): Promise<User> {
    const updatedUser = await this.userRepository.updateById(id, updateDto, option);
    if (!updatedUser)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return updatedUser;
  }

  async updateUserStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    const user = await this.getOneById(id, option);

    if (user.status === updateUserStatusDto.status) return user;

    if (updateUserStatusDto.status === UserStatus.ACTIVE) {
      await this.sendAccountActivation({ email: user.email }, option);
    } else if (updateUserStatusDto.status === UserStatus.INACTIVE) {
      user.disable();
      await this.userRepository.update(user, option);
      await this.sessionRepository.deleteUserDeviceSession(user.id, undefined, option);
    }

    return user;
  }

  async updateMFAStatus(
    id: string,
    updateMFAStatusDto: UpdateMFAStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    const updatedUser = await this.userRepository.updateById(
      id,
      {
        enableMFA: updateMFAStatusDto.enableMFA,
      },
      option
    );
    if (!updatedUser)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    return updatedUser;
  }

  //#endregion

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.userRepository.deleteById(id, option);
  }

  async changePassword(changePasswordDto: ChangePasswordDto, option: ServiceOption): Promise<void> {
    const user = await this.getOneById(extractAuthUserId(option), option);
    user.changePassword(changePasswordDto.oldPassword, changePasswordDto.newPassword);

    await this.update(user, option);
    await this.sessionRepository.deleteUserDeviceSession(user.id, undefined, option);
  }

  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto,
    option?: ServiceOption
  ): Promise<void> {
    const user = await this.userRepository.findOneByEmail(forgotPasswordDto.email, option);
    if (!user)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );

    if (!user.isActive) {
      throw new UnauthorizedException(errorMessage.ACCOUNT_NOT_ACTIVATED);
    }

    const mfa = await this.mfaService.createMfa(
      {
        action: MfaAction.RESET_PASSWORD,
        type: MfaType.ONE_TIME_LINK,
        user: this.userToMfaUser(user),
      },
      option
    );

    this.userMessagePublisher.publishResetPasswordEvent(new ResetPasswordEvent(user, mfa));
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto, option: ServiceOption): Promise<void> {
    const mfaTokenPayload = await this.mfaService.verifyAndUse(
      {
        action: MfaAction.RESET_PASSWORD,
        type: MfaType.ONE_TIME_LINK,
        token: resetPasswordDto.token,
      },
      option
    );

    const mfaUser = new MfaUser(mfaTokenPayload.user).asAuthenticated;

    const user = await this.getOneById(mfaUser.id, option);

    user.updatePassword(resetPasswordDto.newPassword);
    await this.update(user, option);
  }

  async sendAccountActivation(
    sendAccountActivationDto: SendAccountActivationDto,
    option?: ServiceOption
  ): Promise<void> {
    const user = await this.getOneByEmail(sendAccountActivationDto.email, option);
    if (user.isActive) throw new BadRequestException(errorMessage.ACCOUNT_ALREADY_ACTIVATED);

    user.initiateActivation();
    await this.update(user, option);

    const mfa = await this.mfaService.createMfa(
      {
        action: MfaAction.ACCOUNT_ACTIVATION,
        type: MfaType.ONE_TIME_LINK,
        user: this.userToMfaUser(user),
      },
      option
    );

    this.userMessagePublisher.publishAccountActivationEvent(new AccountActivationEvent(user, mfa));
  }

  async activateAccount(
    activateAccountDto: ActivateAccountDto,
    option?: ServiceOption
  ): Promise<void> {
    const mfaTokenPayload = await this.mfaService.verifyAndUse(
      {
        action: MfaAction.ACCOUNT_ACTIVATION,
        type: MfaType.ONE_TIME_LINK,
        token: activateAccountDto.token,
      },
      option
    );

    const mfaUser = new MfaUser(mfaTokenPayload.user).asAuthenticated;

    const user = await this.getOneById(mfaUser.id, option);

    user.activate(activateAccountDto.password);
    await this.update(user, option);
  }

  private userToMfaUser(user: User): MfaUser {
    return new MfaUser({
      id: user.id,
      name: {
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName,
      },
      email: user.email,
      phone: user.cellPhone,
    });
  }
}
