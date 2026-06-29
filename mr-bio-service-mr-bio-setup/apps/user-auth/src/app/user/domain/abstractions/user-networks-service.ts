import { ServiceOption } from '@mr-bio/core/shared';
import { User, UserNetwork, UserNetworkReference } from '../core/entities/user';

export abstract class UserNetworksService {
  // abstract getUserNetworks(userId: string, option?: ServiceOption): Promise<UserNetwork[]>;
  abstract updateUserNetworks(
    network: UserNetworkReference,
    option: ServiceOption
  ): Promise<number>;
  abstract deleteUserNetworks(networkId: string, option: ServiceOption): Promise<void>;
  abstract assignNetworkToUser(
    userId: string,
    networkId: string,
    option: ServiceOption
  ): Promise<User>;
  abstract unassignNetworkFromUser(
    userId: string,
    networkId: string,
    option: ServiceOption
  ): Promise<User>;
}
