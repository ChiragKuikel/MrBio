import { Injectable } from '@nestjs/common';
import { PaginatedResponse } from '@mr-bio/core/shared';
import { CreateUserDto } from '../domain/dtos/create-user';
import { UpdateUserDto } from '../domain/dtos/update-user';
import { User, UserStatus } from '../domain/core/entities/user';
import { UserService } from '../domain/abstractions/user-service';
import { UpdateMFAStatusDto } from '../domain/dtos/update-mfa-status';
import { UpdateUserStatusDto } from '../domain/dtos/update-user-status';
import { UserServiceBaseDecorator } from './user-service-base-decorator';
import { ActiveUserQueryOptions, UserQueryOptions } from '../domain/dtos/user-query';
import {
  EntityActivityLogPublisher,
  EntityActivityLogPublisherFactory,
  FindAllResponse,
  ProjectModule,
  ServiceOption,
} from '@mr-bio/core/shared';

@Injectable()
export class UserServiceActivityLogDecorator extends UserServiceBaseDecorator {
  module: ProjectModule = ProjectModule.USER;
  activityLogPublisher: EntityActivityLogPublisher<User>;

  constructor(
    userService: UserService,
    activityLogPublisherFactory: EntityActivityLogPublisherFactory
  ) {
    super(userService);
    this.activityLogPublisher = activityLogPublisherFactory.create(this.module);
  }

  async create(createDto: CreateUserDto, option?: ServiceOption): Promise<User> {
    const user = await super.create(createDto, option);

    this.activityLogPublisher.publishCreateLog(
      user,
      {
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName,
      },
      option
    );

    return user;
  }

  async updateById(id: string, updateDto: UpdateUserDto, option?: ServiceOption): Promise<User> {
    const user = await super.getOneById(id, option);

    const updatedUser = await super.updateById(id, updateDto, option);

    this.activityLogPublisher.publishUpdateLog(user, updatedUser, option);

    return updatedUser;
  }

  async updateUserStatus(
    id: string,
    updateUserStatusDto: UpdateUserStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    const user = await super.getOneById(id, option);

    const updatedUser = await super.updateUserStatus(id, updateUserStatusDto, option);

    this.activityLogPublisher.publishUpdateLog(user, updatedUser, option);

    return updatedUser;
  }

  async updateMFAStatus(
    id: string,
    updateMFAStatusDto: UpdateMFAStatusDto,
    option?: ServiceOption
  ): Promise<User> {
    const user = await super.getOneById(id, option);

    const updatedUser = await super.updateMFAStatus(id, updateMFAStatusDto, option);

    this.activityLogPublisher.publishUpdateLog(user, updatedUser, option);

    return updatedUser;
  }

  async get(query: UserQueryOptions, option?: ServiceOption): Promise<PaginatedResponse<User>> {
    const result = super.get(query, option);

    this.activityLogPublisher.publishSearchLog(query, option);

    return result;
  }

  async getActiveUsers(
    query: ActiveUserQueryOptions,
    option: ServiceOption
  ): Promise<PaginatedResponse<User>> {
    const result = super.getActiveUsers(query, option);

    this.activityLogPublisher.publishSearchLog({ ...query, status: UserStatus.ACTIVE }, option);

    return result;
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    await super.deleteById(id, option);

    this.activityLogPublisher.publishDeleteLog(id, option);
  }
}
