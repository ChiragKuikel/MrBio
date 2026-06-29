// import { mock } from 'jest-mock-extended';
// import { errorMessage } from '../../../shared/constants';
// import { UserService } from './abstractions/user-service';
// import { User, UserNetworkStatus } from './core/entities/user';
// import { UserNetworksServiceImpl } from './user-networks-service-impl';
// import { UserNetworksService } from './abstractions/user-networks-service';
// import { UserRepository } from '../repository/abstractions/user-repository';
// import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';
// import {
//   BadRequestException,
//   NetworkReference,
//   NotFoundException,
//   ServiceOption,
// } from '@mr-bio/core/shared';

// describe('UserNetworksServiceImpl', () => {
//   let userNetworksService: UserNetworksService;
//   const userRepository = mock<UserRepository>();
//   const networkServiceClient = mock<NetworkServiceClient>();
//   const userService = mock<UserService>();

//   beforeEach(() => {
//     userNetworksService = new UserNetworksServiceImpl(
//       userRepository,
//       networkServiceClient,
//       userService
//     );
//   });

//   describe('assignNetworkToUser', () => {
//     it('should throw NotFoundException if the user is not found', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const networkIdToAssign = 'network_id_A';
//       userService.getOneById.mockRejectedValue(new NotFoundException('User not found'));

//       // Act
//       const result = userNetworksService.assignNetworkToUser(existingUserId, networkIdToAssign, {});

//       // Assert
//       await expect(result).rejects.toThrow(NotFoundException);
//     });

//     it('show throw NotFoundException if the network is not found', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const networkIdToAssign = 'network_id_A';
//       userService.getOneById.mockResolvedValue(user);
//       networkServiceClient.getNetworkById.mockRejectedValue(
//         new NotFoundException('Network not found')
//       );

//       // Act
//       const result = userNetworksService.assignNetworkToUser(existingUserId, networkIdToAssign, {});

//       // Assert
//       await expect(result).rejects.toThrow(NotFoundException);
//     });

//     it('show assign the network to the user if the user does not have any network', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       user.networks = undefined;

//       const networkIdToAssign = 'network_id_A';

//       userService.getOneById.mockResolvedValue(user);
//       networkServiceClient.getNetworkById.mockResolvedValue({
//         id: networkIdToAssign,
//         code: 'NETWORK_A',
//         name: 'Network A',
//       });
//       userService.updateById.mockResolvedValue(user);

//       // Act
//       const result = await userNetworksService.assignNetworkToUser(
//         existingUserId,
//         networkIdToAssign,
//         {}
//       );

//       // Assert
//       expect(result).toEqual(
//         expect.objectContaining({
//           networks: expect.arrayContaining([
//             expect.objectContaining({
//               id: networkIdToAssign,
//               code: 'NETWORK_A',
//               name: 'Network A',
//               status: UserNetworkStatus.ACTIVE,
//             }),
//           ]),
//         })
//       );
//     });

//     it('show assign the new network to the user even if the user has existing networks assigned', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };
//       user.networks = [
//         {
//           id: 'network_id_B',
//           code: 'NETWORK_B',
//           name: 'Network B',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.ACTIVE,
//         },
//       ];

//       const networkIdToAssign = 'network_id_A';

//       userService.getOneById.mockResolvedValue(user);
//       networkServiceClient.getNetworkById.mockResolvedValue({
//         id: networkIdToAssign,
//         code: 'NETWORK_A',
//         name: 'Network A',
//       });
//       userService.updateById.mockResolvedValue(user);

//       // Act
//       const result = await userNetworksService.assignNetworkToUser(
//         existingUserId,
//         networkIdToAssign,
//         {}
//       );

//       // Assert
//       expect(result).toEqual(
//         expect.objectContaining({
//           networks: expect.arrayContaining([
//             expect.objectContaining({
//               id: 'network_id_B',
//               code: 'NETWORK_B',
//               name: 'Network B',
//               status: UserNetworkStatus.ACTIVE,
//             }),
//             expect.objectContaining({
//               id: networkIdToAssign,
//               code: 'NETWORK_A',
//               name: 'Network A',
//               status: UserNetworkStatus.ACTIVE,
//             }),
//           ]),
//         })
//       );
//     });

//     it('show not duplicate the network if the user has already been assigned the network', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };

//       const networkIdToAssign = 'network_id_A';

//       user.networks = [
//         {
//           id: 'network_id_A',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.ACTIVE,
//         },
//       ];

//       userService.getOneById.mockResolvedValue(user);
//       networkServiceClient.getNetworkById.mockResolvedValue({
//         id: networkIdToAssign,
//         code: 'NETWORK_A',
//         name: 'Network A',
//       });
//       userService.updateById.mockResolvedValue(user);

//       // Act
//       const result = await userNetworksService.assignNetworkToUser(
//         existingUserId,
//         networkIdToAssign,
//         {}
//       );

//       // Assert
//       expect(result.networks).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             id: networkIdToAssign,
//             code: 'NETWORK_A',
//             name: 'Network A',
//             status: UserNetworkStatus.ACTIVE,
//           }),
//         ])
//       );
//       expect(result.networks?.length).toBe(1);
//     });

//     it('show change the status of the network to ACTIVE if the user has already been assigned the network', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };

//       const networkIdToAssign = 'network_id_A';

//       user.networks = [
//         {
//           id: 'network_id_A',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.INACTIVE,
//         },
//       ];

//       userService.getOneById.mockResolvedValue(user);
//       networkServiceClient.getNetworkById.mockResolvedValue({
//         id: networkIdToAssign,
//         code: 'NETWORK_A',
//         name: 'Network A',
//       });
//       userService.updateById.mockResolvedValue(user);

//       // Act
//       const result = await userNetworksService.assignNetworkToUser(
//         existingUserId,
//         networkIdToAssign,
//         {}
//       );

//       // Assert
//       expect(result.networks).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             id: networkIdToAssign,
//             code: 'NETWORK_A',
//             name: 'Network A',
//             status: UserNetworkStatus.ACTIVE,
//           }),
//         ])
//       );
//       expect(result.networks?.length).toBe(1);
//     });
//   });

//   describe('unassignNetworkFromUser', () => {
//     it('should throw NotFoundException if the user is not found', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const networkIdToUnassign = 'network_id_A';
//       userService.getOneById.mockRejectedValue(new NotFoundException('User not found'));

//       // Act
//       const result = userNetworksService.unassignNetworkFromUser(
//         existingUserId,
//         networkIdToUnassign,
//         {}
//       );

//       // Assert
//       await expect(result).rejects.toThrow(NotFoundException);
//     });

//     it('should throw BadRequestException if the network is not assigned to the user (or its status is not ACTIVE)', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };
//       user.networks = [
//         {
//           id: 'network_id_A',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.INACTIVE,
//         },
//       ];
//       const networkIdToUnassign = 'network_id_A';
//       userService.getOneById.mockResolvedValue(user);

//       // Act
//       const result = userNetworksService.unassignNetworkFromUser(
//         existingUserId,
//         networkIdToUnassign,
//         {}
//       );

//       // Assert
//       await expect(result).rejects.toThrow(
//         new BadRequestException(errorMessage.NETWORK_NOT_ASSIGNED_USER)
//       );
//     });

//     it('should set status of the network to INACTIVE if the network is assigned to the user', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User(existingUserId);
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };
//       user.networks = [
//         {
//           id: 'network_id_A',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.ACTIVE,
//         },
//         {
//           id: 'network_id_B',
//           code: 'NETWORK_B',
//           name: 'Network B',
//           created: updatedBy,
//           updated: updatedBy,
//           status: UserNetworkStatus.ACTIVE,
//         },
//       ];
//       const networkIdToUnassign = 'network_id_A';
//       userService.getOneById.mockResolvedValue(user);
//       userService.updateById.mockResolvedValue(user);

//       // Act
//       const result = await userNetworksService.unassignNetworkFromUser(
//         existingUserId,
//         networkIdToUnassign,
//         {}
//       );

//       // Assert
//       expect(result.networks).toEqual(
//         expect.arrayContaining([
//           expect.objectContaining({
//             id: 'network_id_B',
//             code: 'NETWORK_B',
//             name: 'Network B',
//             status: UserNetworkStatus.ACTIVE,
//           }),
//           expect.objectContaining({
//             id: networkIdToUnassign,
//             code: 'NETWORK_A',
//             name: 'Network A',
//             status: UserNetworkStatus.INACTIVE,
//           }),
//         ])
//       );
//       expect(result.networks?.length).toBe(2);
//     });
//   });

//   describe('getUserNetworks', () => {
//     it('should throw NotFoundException if the user is not found', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       userRepository.findOneById.mockRejectedValue(new NotFoundException('User not found'));

//       // Act
//       const result = userNetworksService.getUserNetworks(existingUserId, {});

//       // Assert
//       await expect(result).rejects.toThrow(NotFoundException);
//     });

//     it('should return only active networks', async () => {
//       // Arrange
//       const existingUserId = 'USER_A';
//       const user = new User();
//       const updatedBy = { id: '1', name: 'User A', at: new Date() };
//       const activeNetworks = [
//         {
//           id: '1',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           status: UserNetworkStatus.ACTIVE,
//           created: updatedBy,
//           updated: updatedBy,
//         },
//       ];
//       const inactiveNetworks = [
//         {
//           id: '2',
//           code: 'NETWORK_B',
//           name: 'Network B',
//           status: UserNetworkStatus.INACTIVE,
//           created: updatedBy,
//           updated: updatedBy,
//         },
//       ];
//       // user.networks = [...activeNetworks, ...inactiveNetworks];

//       userRepository.findOneById.mockResolvedValue(user);

//       // Act
//       // const activeNetworksResult = await userNetworksService.getUserNetworks(existingUserId, {});

//       // Assert
//       expect(userService.getOneById).toHaveBeenCalledWith(existingUserId, {});
//       // expect(activeNetworksResult).toEqual(activeNetworks);
//     });
//   });

//   describe('deleteNetworkInUsers', () => {
//     it('should delete user network', async () => {
//       const networkId = 'test-network-id';

//       const mockOption: ServiceOption = {};
//       userRepository.deleteUserNetworks.mockResolvedValue();

//       await userNetworksService.deleteUserNetworks(networkId, mockOption);

//       expect(userRepository.deleteUserNetworks).toHaveBeenCalledWith(networkId, mockOption);
//     });
//     it('should throw NotFoundException if the network is not found', async () => {
//       const networkId = 'test-network-id';

//       const mockOption: ServiceOption = {};
//       userRepository.deleteUserNetworks.mockRejectedValue(
//         new NotFoundException('Network not found')
//       );

//       await expect(userNetworksService.deleteUserNetworks(networkId, mockOption)).rejects.toThrow(
//         NotFoundException
//       );
//       expect(userRepository.deleteUserNetworks).toHaveBeenCalledWith(networkId, mockOption);
//     });
//   });
//   describe('updateNetworkInUsers', () => {
//     it('should update user network', async () => {
//       const mockNetwork = {
//         id: 'network123',
//         code: 'NET_ABCD',
//         name: 'NET ABCD',
//       } as NetworkReference;

//       const mockOption: ServiceOption = {};
//       userRepository.updateUserNetworks.mockResolvedValue(1);

//       await userNetworksService.updateUserNetworks(mockNetwork, mockOption);

//       expect(userRepository.updateUserNetworks).toHaveBeenCalledWith(mockNetwork, mockOption);
//     });
//     it('should throw NotFoundException if the network is not found', async () => {
//       const mockNetwork = {
//         id: 'network123',
//         code: 'NET_ABCD',
//         name: 'NET ABCD',
//       } as NetworkReference;
//       const mockOption: ServiceOption = {};
//       userRepository.updateUserNetworks.mockRejectedValue(
//         new NotFoundException('Network not found')
//       );

//       await expect(userNetworksService.updateUserNetworks(mockNetwork, mockOption)).rejects.toThrow(
//         NotFoundException
//       );
//       expect(userRepository.updateUserNetworks).toHaveBeenCalledWith(mockNetwork, mockOption);
//     });
//   });
// });
