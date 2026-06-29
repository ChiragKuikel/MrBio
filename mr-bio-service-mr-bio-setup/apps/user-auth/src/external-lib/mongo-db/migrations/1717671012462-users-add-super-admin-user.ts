import { randomUUID } from 'crypto';
import { Gender } from '@mr-bio/core/shared';
import { IMigration, DB } from 'db-mongo-migration';
import { HashedValue } from '../../../shared/value-objects/hashed-value';
import { UserStatus } from '../../../app/user/domain/core/entities/user';
import { UserSchema } from '../../../app/user/repository/schemas/user-schema';

class Migration implements IMigration {
  collectionName = 'userAuth_users';
  username = 'super-admin';
  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const assigner = {
      by: 'System',
      at: new Date(),
    };
    const data: UserSchema = {
      status: UserStatus.ACTIVE,
      created: assigner,
      updated: assigner,
      userId: randomUUID(),
      username: `${this.username}`,
      email: `${this.username}@noveltytechnology.com`,
      association: {
        resources: [],
        roles: ['SUPER-ADMIN'],
      },
      demographic: {
        name: {
          middleName: '',
          lastName: 'Admin',
          firstName: 'Super',
        },
        gender: Gender.OTHER,
      },
      security: {
        enableMFA: true,
        loginAttempts: 0,
        passwordHistory: [],
        password: HashedValue.fromValue('dsS1Kj22h@!h192bd').hash,
      },
      // organization: {
      //   id: 'mr_bio',
      //   name: 'Mr Bio',
      //   code: 'mr_bio',
      // },
    };

    await db.insertOne(this.collectionName, data as any);
  }

  /**
   * Reverse the migrations.
   */
  async down(db: DB) {
    await db.deleteMany(this.collectionName, {
      ['association.roles']: { $in: ['SUPER-ADMIN'] },
    } as any);
  }
}

export default Migration;
