import { UserQueryOptions } from '../../domain/dtos/user-query';
import { User, UserNetworkReference } from '../../domain/core/entities/user';
import { BaseRepository, Nullable, ServiceOption } from '@mr-bio/core/shared';
import { UserAssociationDetail } from '../../domain/dtos/user-association-detail';

export abstract class UserRepository extends BaseRepository<User, UserQueryOptions> {
  abstract findOneByIdentifier(identifier: string, option?: ServiceOption): Promise<Nullable<User>>;
  abstract findOneByEmail(email: string, option?: ServiceOption): Promise<Nullable<User>>;
  abstract findUserAssociationDetail(
    id: string,
    option?: ServiceOption
  ): Promise<Nullable<UserAssociationDetail>>;
  abstract update(user: User, option?: ServiceOption): Promise<Nullable<User>>;
  abstract updateUserNetworks(
    network: UserNetworkReference,
    option: ServiceOption
  ): Promise<number>;
  abstract deleteUserNetworks(networkId: string, option: ServiceOption): Promise<void>;
}
