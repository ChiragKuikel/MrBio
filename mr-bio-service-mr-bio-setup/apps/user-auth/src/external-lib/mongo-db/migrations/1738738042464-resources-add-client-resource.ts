import { randomUUID } from 'crypto';
import { IMigration, DB } from 'db-mongo-migration';

class Migration implements IMigration {
  collectionName = 'userAuth_resources';

  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const assigner = {
      by: 'System',
      at: new Date(),
    };
    const data = {
      icon: '',
      order: 11,
      activeIcon: '',
      created: assigner,
      updated: assigner,
      code: 'CLIENT-MANAGEMENT',
      name: 'client Management',
      resourceId: randomUUID(),
      routePath: '/client-management',
      permissions: [
        {
          label: 'Create new client',
          code: 'CLIENT-MANAGEMENT-CREATE',
          description: 'Ability to create a new client.',
        },
        {
          label: 'Read clients',
          code: 'CLIENT-MANAGEMENT-READ',
          description: 'Ability to access all clients.',
        },
        {
          label: 'Update client',
          code: 'CLIENT-MANAGEMENT-UPDATE',
          description: 'Ability to update a client.',
        },
        {
          label: 'Delete client',
          code: 'CLIENT-MANAGEMENT-DELETE',
          description: 'Ability to delete a client.',
        },
        {
          label: 'Create client secret',
          code: 'CLIENT-MANAGEMENT-CREATE-CLIENT-SECRET',
          description: 'Ability to create a client secret.',
        },
        {
          label: 'Revoke client secret',
          code: 'CLIENT-MANAGEMENT-REVOKE-CLIENT-SECRET',
          description: 'Ability to revoke a client secret.',
        },
        {
          label: 'Create access token',
          code: 'CLIENT-MANAGEMENT-CREATE-ACCESS-TOKEN',
          description: 'Ability to create an access token.',
        },
      ],
    };

    await db.insertOne(this.collectionName, data as any);
  }

  /**
   * Reverse the migrations.
   */
  async down(db: DB) {
    await db.deleteMany(this.collectionName, {
      code: 'CLIENT-MANAGEMENT',
    });
  }
}

export default Migration;
