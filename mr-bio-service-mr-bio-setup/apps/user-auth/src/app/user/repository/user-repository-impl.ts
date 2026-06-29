import { Injectable } from '@nestjs/common';
import { UserModel } from './models/user-model';
import { UserSchema } from './schemas/user-schema';
import { UserQueryOptions } from '../domain/dtos/user-query';
import { Nullable, ServiceOption } from '@mr-bio/core/shared';
import { UserRepository } from './abstractions/user-repository';
import { User, UserNetworkReference } from '../domain/core/entities/user';
import { UserPersistenceMapper } from './mappers/user-persistence-mapper';
import { UserAssociationDetail } from '../domain/dtos/user-association-detail';
import { BaseRepositoryImpl, prepareSoftDeletionCondition } from '@mr-bio/core/external-lib';

@Injectable()
export class UserRepositoryImpl
  extends BaseRepositoryImpl<User, UserSchema, UserQueryOptions>
  implements UserRepository
{
  constructor(
    protected model: UserModel,
    protected mapper: UserPersistenceMapper
  ) {
    super(model, mapper);
  }

  async findOneByIdentifier(identifier: string, option?: ServiceOption): Promise<Nullable<User>> {
    const userEntity = await this.model.model?.findOne(
      {
        $and: [
          { $or: [{ email: identifier }, { username: identifier }] },
          prepareSoftDeletionCondition(),
        ],
      },

      option
    );
    if (userEntity) return this.mapper.persistenceToDomain(userEntity);

    return null;
  }

  async findOneByEmail(email: string, option?: ServiceOption): Promise<Nullable<User>> {
    const userEntity = await this.model.findOne({ email }, option);
    if (userEntity) return this.mapper.persistenceToDomain(userEntity);

    return null;
  }

  async findUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<Nullable<UserAssociationDetail>> {
    return await this.model.findUserAssociationDetail(id, option);
  }

  async updateUserNetworks(network: UserNetworkReference, option: ServiceOption): Promise<number> {
    return await this.model.updateMany(
      { 'networks.id': network.id },
      {
        'networks.$.name': network.name,
        'networks.$.code': network.code,
      },
      option
    );
  }
  async deleteUserNetworks(networkId: string, option: ServiceOption): Promise<void> {
    await this.model.deleteMany({ 'networks.id': networkId }, option);
  }
}
