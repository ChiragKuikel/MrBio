// import { User, UserNetworkStatus } from './user';
// import { BadRequestException } from '@mr-bio/core/shared';
// import { HashedValue } from '../../../../../shared/value-objects/hashed-value';
// import { InvalidCredentialException } from '../../../../../shared/exception/invalid-credentials-exception';

// describe('User', () => {
//   describe('Login in', () => {
//     it('should log in user with correct password', () => {
//       // Arrange
//       const correctPassword = 'password';
//       const user = new User();
//       user.password = HashedValue.fromValue(correctPassword);

//       // Act
//       user.login(correctPassword);

//       // Assert
//       // expect no error
//     });

//     it('should throw InvalidCredentialException with incorrect password', () => {
//       // Arrange
//       const correctPassword = 'password';
//       const incorrectPassword = 'password123';
//       const user = new User();
//       user.password = HashedValue.fromValue(correctPassword);

//       // Act & Assert
//       expect(() => user.login(incorrectPassword)).toThrow(InvalidCredentialException);
//       expect(user.loginAttempts).toBe(1);
//     });
//   });

//   describe('Log out', () => {
//     it('should clear login attempts after logout', () => {
//       // Arrange
//       const user = new User();

//       // Act
//       user.logout();

//       // Assert
//       expect(user.loginAttempts).toBe(0);
//     });
//   });

//   describe('Change user password', () => {
//     it('should throw BadRequestException if password has not been set', () => {
//       // Arrange
//       const user = new User();

//       // Act & Assert
//       expect(() => user.changePassword('password', 'password123')).toThrow(BadRequestException);
//     });

//     it('should throw InvalidCredentialException if current password is incorrect', () => {
//       // Arrange
//       const currentPassword = 'password';
//       const incorrectPassword = 'password1';
//       const user = new User();
//       user.password = HashedValue.fromValue(currentPassword);

//       // Act & Assert
//       expect(() => user.changePassword(incorrectPassword, 'password123')).toThrow(
//         InvalidCredentialException
//       );
//     });

//     it('should change password for valid change request', () => {
//       // Arrange
//       const currentPassword = 'password';
//       const newPassword = 'newPassword';
//       const user = new User();
//       user.password = HashedValue.fromValue(currentPassword);
//       jest.spyOn(user, 'updatePassword');

//       // Act
//       user.changePassword(currentPassword, newPassword);

//       // Assert
//       expect(user.updatePassword).toHaveBeenCalled();
//       expect(user.password.compare(newPassword)).toBe(true);
//     });
//   });

//   describe('Update password', () => {
//     it('should throw BadRequestException if password has not been set', () => {
//       // Arrange
//       const user = new User();

//       // Act & Assert
//       expect(() => user.updatePassword('password123')).toThrow(BadRequestException);
//     });

//     it('should throw BadRequestException if current password is used as new', () => {
//       // Arrange
//       const currentPassword = 'password';
//       const user = new User();
//       user.password = HashedValue.fromValue(currentPassword);

//       // Act & Assert
//       expect(() => user.updatePassword(currentPassword)).toThrow(BadRequestException);
//     });

//     it('should throw BadRequestException if past 3 passwords are used as new', () => {
//       // Arrange
//       const currentPassword = 'password';
//       const firstPassword = 'password1';
//       const secondPassword = 'password2';
//       const thirdPassword = 'password3';
//       const fourthPassword = 'password4';
//       const user = new User();
//       user.password = HashedValue.fromValue(currentPassword);
//       user.passwordHistory = [
//         HashedValue.fromValue(firstPassword),
//         HashedValue.fromValue(secondPassword),
//         HashedValue.fromValue(thirdPassword),
//         HashedValue.fromValue(fourthPassword),
//       ];

//       // Act & Assert
//       expect(() => user.updatePassword(fourthPassword)).toThrow(BadRequestException);
//       expect(() => user.updatePassword(thirdPassword)).toThrow(BadRequestException);
//       expect(() => user.updatePassword(secondPassword)).toThrow(BadRequestException);
//       expect(() => user.updatePassword(firstPassword)).not.toThrow(BadRequestException);
//     });

//     it('should update password for valid update request', () => {
//       // Arrange
//       const currentPassword = 'password';
//       const newPassword = 'newPassword';
//       const user = new User();
//       user.password = HashedValue.fromValue(currentPassword);

//       // Act
//       user.updatePassword(newPassword);

//       // Assert
//       expect(user.password.compare(newPassword)).toBe(true);
//       expect(Array.isArray(user.passwordHistory)).toBe(true);
//       expect(user.passwordHistory!.length).toBe(1);
//       expect(user.passwordHistory![0]!.compare(currentPassword)).toBe(true);
//     });
//   });

//   describe('Get Active Networks', () => {
//     it('should provide only active networks that the user is assigned to', () => {
//       // Arrange
//       const user = new User();

//       const updatedBy = { id: '1', name: 'User A', at: new Date() };
//       const existingNetworks = [
//         {
//           id: '1',
//           code: 'NETWORK_A',
//           name: 'Network A',
//           status: UserNetworkStatus.ACTIVE,
//           created: updatedBy,
//           updated: updatedBy,
//         },
//         {
//           id: '2',
//           code: 'NETWORK_B',
//           name: 'Network B',
//           status: UserNetworkStatus.INACTIVE,
//           created: updatedBy,
//           updated: updatedBy,
//         },
//       ];

//       user.networks = [...existingNetworks];

//       const expectedActiveNetworks = existingNetworks.filter(
//         network => network.status === UserNetworkStatus.ACTIVE
//       );

//       jest.spyOn(user, 'getActiveNetworks');

//       // Act
//       const activeUserNetworks = user.getActiveNetworks();

//       // Assert
//       expect(user.getActiveNetworks).toHaveBeenCalled();
//       expect(activeUserNetworks).toEqual(expectedActiveNetworks);
//     });
//   });
// });
