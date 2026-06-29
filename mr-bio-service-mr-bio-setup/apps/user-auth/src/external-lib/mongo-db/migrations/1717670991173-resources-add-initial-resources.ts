import { randomUUID } from 'crypto';
import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { ResourceSchema } from '../../../app/authorization/repository/schemas/resource-schema';

class Migration implements IMigration {
  collectionName = dbCollections.RESOURCE;

  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const assigner = {
      by: 'System',
      at: new Date(),
    };
    const data: ResourceSchema[] = [
      {
        order: 1,
        code: 'SETTING',
        name: 'Setting',
        permissions: [],
        created: assigner,
        updated: assigner,
        icon: 'BsGearFill',
        routePath: '/settings',
        resourceId: randomUUID(),
        activeIcon: 'BsGearFill',
      },
      {
        icon: '',
        order: 2,
        activeIcon: '',
        parent: 'SETTING',
        created: assigner,
        updated: assigner,
        code: 'USER-MANAGEMENT',
        name: 'User Management',
        resourceId: randomUUID(),
        routePath: '/settings/user-management',
        permissions: [
          {
            label: 'Read users',
            code: 'USER-MANAGEMENT-READ',
            description: 'Ability to access all users.',
          },
          {
            label: 'Read Active users',
            code: 'USER-MANAGEMENT-READ-ACTIVE',
            description: 'Ability to access only active users.',
          },
          {
            label: 'Create new user',
            code: 'USER-MANAGEMENT-CREATE',
            description: 'Ability to create a new user.',
          },
          {
            label: 'Update user',
            code: 'USER-MANAGEMENT-UPDATE',
            description: 'Ability to update a user.',
          },
          {
            label: 'Delete user',
            code: 'USER-MANAGEMENT-DELETE',
            description: 'Ability to delete a user.',
          },
          {
            label: 'Send Invitation',
            code: 'USER-MANAGEMENT-INVITE',
            description: 'Send an invitation to a user for account activation.',
          },
          {
            isRequiredForAdmin: true,
            label: 'Manage Permission(s)',
            code: 'USER-MANAGEMENT-MANAGE-PERMISSION',
            description: 'Ability to manage permissions for a user.',
          },
        ],
      },
      {
        icon: '',
        order: 3,
        activeIcon: '',
        parent: 'SETTING',
        created: assigner,
        updated: assigner,
        resourceId: randomUUID(),
        name: 'Roles & Permissions',
        code: 'ROLES-PERMISSION-MANAGEMENT',
        routePath: '/settings/roles-permission-management',
        permissions: [
          {
            label: 'Create new Role',
            code: 'ROLES-PERMISSION-MANAGEMENT-CREATE',
            description: 'Ability to a create new role.',
          },
          {
            label: 'Read Roles',
            code: 'ROLES-PERMISSION-MANAGEMENT-READ',
            description: 'Ability to access all roles.',
          },
          {
            label: 'Update Role',
            code: 'ROLES-PERMISSION-MANAGEMENT-UPDATE',
            description: 'Ability to update a role.',
          },
          {
            label: 'Delete Role',
            code: 'ROLES-PERMISSION-MANAGEMENT-DELETE',
            description: 'Ability to delete a role.',
          },
          {
            isRequiredForAdmin: true,
            label: 'Manage Permission(s)',
            code: 'ROLES-PERMISSION-MANAGEMENT-MANAGE-PERMISSION',
            description: 'Ability to manage permissions for a role.',
          },
        ],
      },
      {
        icon: '',
        order: 4,
        activeIcon: '',
        parent: 'SETTING',
        created: assigner,
        updated: assigner,
        code: 'ACTIVITY-LOG',
        name: 'Activity Log',
        resourceId: randomUUID(),
        routePath: '/settings/activity-log',
        permissions: [
          {
            code: 'ACTIVITY-LOG-READ',
            label: 'Read Activity Logs',
            description: 'Ability to access all activity Logs.',
          },
        ],
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
        $in: ['ACTIVITY-LOG', 'ROLES-PERMISSION-MANAGEMENT', 'USER-MANAGEMENT', 'SETTING'],
      },
    });
  }
}

export default Migration;
