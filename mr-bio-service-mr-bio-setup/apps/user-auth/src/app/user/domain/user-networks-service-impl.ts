import { errorMessage } from '../../../shared/constants';
import { UserService } from './abstractions/user-service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { UserNetworksService } from './abstractions/user-networks-service';
import { UserRepository } from '../repository/abstractions/user-repository';
import { User, UserNetwork, UserNetworkReference } from './core/entities/user';
import { NotFoundException, resolveAssigner, ServiceOption } from '@mr-bio/core/shared';
import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';

@Injectable()
export class UserNetworksServiceImpl implements UserNetworksService {
  constructor(
    private userRepository: UserRepository,
    private networkServiceClient: NetworkServiceClient,
    private userService: UserService
  ) {}

  async assignNetworkToUser(
    userId: string,
    networkId: string,
    option: ServiceOption
  ): Promise<User> {
    const user = await this.userService.getOneById(userId, option);
    const network = await this.networkServiceClient.getNetworkById(networkId, option);

    const updated = resolveAssigner(option);

    // user.assignNetworkToUser(network, updated);

    return (await this.userService.updateById(user.id, { networks: [] }, option))!;
  }

  async unassignNetworkFromUser(
    userId: string,
    networkId: string,
    option: ServiceOption
  ): Promise<User> {
    const user = await this.userService.getOneById(userId, option);

    // if (!user.getIsActiveNetwork(networkId)) {
    //   throw new BadRequestException(errorMessage.NETWORK_NOT_ASSIGNED_USER);
    // }

    const updated = resolveAssigner(option);

    // user.unassignNetworkFromUser(networkId, updated);

    return (await this.userService.updateById(user.id, { networks: [] }, option))!;
  }

  // async getUserNetworks(userId: string, option?: ServiceOption): Promise<UserNetwork[]> {
  //   const user = await this.userRepository.findOneById(userId, option);

  //   if (!user) throw new NotFoundException(errorMessage.USER_NOT_FOUND);

  //   return user.getActiveNetworks();
  // }

  async updateUserNetworks(network: UserNetworkReference, option: ServiceOption): Promise<number> {
    return await this.userRepository.updateUserNetworks(network, option);
  }
  async deleteUserNetworks(networkId: string, option: ServiceOption): Promise<void> {
    await this.userRepository.deleteUserNetworks(networkId, option);
  }
}
