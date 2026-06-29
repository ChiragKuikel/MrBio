import { randomUUID } from 'crypto';
import { IMigration, DB } from 'db-mongo-migration';
import { RoleSchema } from '../../../app/authorization/repository/schemas/role-schema';

class Migration implements IMigration {
  collectionName = 'userAuth_roles';
  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const assigner = {
      by: 'System',
      at: new Date(),
    };
    const data: RoleSchema[] = [
      {
        resources: [],
        created: assigner,
        updated: assigner,
        code: 'SUPER-ADMIN',
        name: 'Super Admin',
        roleId: randomUUID(),
      },
    ];

    await db.insertMany(this.collectionName, data as any);
  }

  /**
   * Reverse the migrations.
   */
  async down(db: DB) {
    await db.deleteMany(this.collectionName, {
      code: {
        $in: ['SUPER-ADMIN'],
      },
    });
  }
}

export default Migration;
