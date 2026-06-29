import { mock } from 'jest-mock-extended';
import { User } from './core/entities/user';
import { CreateUserDto } from './dtos/create-user';
import { UserServiceImpl } from './user-service-impl';
import { UserService } from './abstractions/user-service';
import { Role } from '../../authorization/domain/core/entities/role';
import { ConflictException, NotFoundException } from '@mr-bio/core/shared';
import { UserRepository } from '../repository/abstractions/user-repository';
import { UserPrivilegesService } from './abstractions/user-privileges-service';
import { MfaService } from '../../authentication/domain/abstractions/mfa-service';
import { RoleService } from '../../authorization/domain/abstractions/role-service';
import { UserMessagePublisher } from '../messaging/abstractions/user-message-publisher';
import { NetworkServiceClient } from '../../../shared/abstractions/network-service-client';
import { SessionRepository } from '../../authentication/repository/abstractions/session-repository';

describe('UserServiceImpl', () => {
  let userService: UserService;
  const userRepository = mock<UserRepository>();
  const mfaService = mock<MfaService>();
  const roleService = mock<RoleService>();
  const sessionRepository = mock<SessionRepository>();
  const userPrivilegesService = mock<UserPrivilegesService>();
  const userMessagePublisher = mock<UserMessagePublisher>();
  const networkServiceClient = mock<NetworkServiceClient>();

  beforeEach(() => {
    userService = new UserServiceImpl(
      mfaService,
      userRepository,
      sessionRepository,
      userPrivilegesService,
      roleService,
      userMessagePublisher,
      networkServiceClient
    );
  });

  describe('create', () => {
    it('should throw ConflictException if the email is already in use', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@gmail.com',
      } as any;
      const existingUser = new User();
      existingUser.email = 'test@gmail.com';
      userRepository.findOneByIdentifier.mockResolvedValue(existingUser);

      // Act
      const createPromise = userService.create(createUserDto, {});

      // Assert
      await expect(createPromise).rejects.toThrow(ConflictException);
    });

    it('should throw error if the organization is not found', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        email: 'test@gmail.com',
        organizationIds: ['unknownOrgId'],
      } as any;
      const existingUser = new User();
      existingUser.email = 'test@gmail.com';
      userRepository.findOneByIdentifier.mockResolvedValue(null);

      networkServiceClient.getOrganizationById.mockRejectedValue(
        new NotFoundException('Organization not found')
      );

      // Act
      const createPromise = userService.create(createUserDto, {});

      // Assert
      await expect(createPromise).rejects.toThrow(new NotFoundException('Organization not found'));
    });

    it('should create user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        firstName: 'firstName',
        lastName: 'lastName',
        organizationId: 'orgId',
        dob: new Date(),
        roleCodes: ['NETWORK-ADMIN'],
      } as any;

      userRepository.findOneByIdentifier.mockResolvedValue(null);
      networkServiceClient.getOrganizationById.mockResolvedValue({
        id: 'orgId',
        code: 'ORG_ID',
        name: 'OrgName',
        networks: [],
      });
      roleService.getOneByCode.mockResolvedValue({ code: 'NETWORK' } as Role);

      userRepository.create.mockImplementation(async user => user);

      // Act
      const createdUser = await userService.create(createUserDto, {});

      // Assert
      expect(createdUser).toEqual(
        expect.objectContaining({ organization: { id: 'orgId', code: 'ORG_ID', name: 'OrgName' } })
      );
    });
  });

  describe('getByIdentifier', () => {
    it('should return a user when a valid identifier is provided', async () => {
      // Arrange
      const expectedUser = new User();
      userRepository.findOneByIdentifier.mockResolvedValue(expectedUser);

      // Act
      const user = await userService.getOneByIdentifier('validIdentifier');

      // Assert
      expect(userRepository.findOneByIdentifier).toHaveBeenCalledWith('validIdentifier', undefined);
      expect(user).toEqual(expectedUser);
    });

    it('should throw NotFoundException when an invalid identifier is provided', async () => {
      // Arrange
      userRepository.findOneByIdentifier.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getOneByIdentifier('invalidIdentifier')).rejects.toThrow(
        NotFoundException
      );
    });
  });

  describe('updateById', () => {
    it('should update user and return the updated user', async () => {
      // Arrange
      const userToUpdate = new User();
      const updatedUser = new User();
      userRepository.updateById.mockResolvedValue(updatedUser);

      // Act
      const user = await userService.updateById(userToUpdate.id, userToUpdate);

      // Assert
      expect(user).toEqual(updatedUser);
      expect(userRepository.updateById).toHaveBeenCalledWith(
        userToUpdate.id,
        userToUpdate,
        undefined
      );
    });

    it('should throw an error when updating a non-existing user', async () => {
      // Arrange
      const nonExistingUser = new User();
      userRepository.updateById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateById(nonExistingUser.id, nonExistingUser)).rejects.toThrow(
        NotFoundException
      );
      expect(userRepository.updateById).toHaveBeenCalledWith(
        nonExistingUser.id,
        nonExistingUser,
        undefined
      );
    });
  });
});
