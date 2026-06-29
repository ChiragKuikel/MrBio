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
        name: 'Organization Admin',
        code: 'ORGANIZATION-ADMIN',
        created: assigner,
        updated: assigner,
        roleId: randomUUID(),
        resources: [
          { code: 'SETTING', permissions: [], isGranted: true },
          {
            isGranted: true,
            parent: 'SETTING',
            code: 'USER-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'USER-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'USER-MANAGEMENT-READ' },
              { isGranted: true, code: 'USER-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'USER-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'USER-MANAGEMENT-INVITE' },
              { isGranted: true, code: 'USER-MANAGEMENT-MANAGE-PERMISSION' },
            ],
          },
          {
            isGranted: true,
            parent: 'SETTING',
            code: 'ROLES-PERMISSION-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'ROLES-PERMISSION-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'ROLES-PERMISSION-MANAGEMENT-READ' },
              { isGranted: true, code: 'ROLES-PERMISSION-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'ROLES-PERMISSION-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'ROLES-PERMISSION-MANAGEMENT-MANAGE-PERMISSION' },
            ],
          },
          {
            isGranted: true,
            parent: 'SETTING',
            code: 'ACTIVITY-LOG',
            permissions: [{ isGranted: true, code: 'ACTIVITY-LOG-READ' }],
          },
          {
            isGranted: true,
            code: 'ORGANIZATION-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'ORGANIZATION-MANAGEMENT-READ' },
              { isGranted: true, code: 'ORGANIZATION-MANAGEMENT-UPDATE' },
            ],
          },
          {
            isGranted: true,
            code: 'NETWORK-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'NETWORK-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-READ' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-UPDATE-SETTINGS' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-INVITE-ORGANIZATION' },
            ],
          },
          {
            isGranted: true,
            code: 'FACILITY-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'FACILITY-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-READ' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-ASSOCIATE-PHYSICIAN' },
            ],
          },
          {
            isGranted: true,
            code: 'PHYSICIAN-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-READ' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-DELETE' },
            ],
          },
          {
            isGranted: true,
            code: 'SERVICE-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'SERVICE-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-READ' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-DELETE' },
            ],
          },
          {
            isGranted: true,
            code: 'PRICING-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'PRICING-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-READ' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-DELETE' },
            ],
          },
          {
            isGranted: true,
            code: 'PROVIDER-MANAGEMENT',
            permissions: [{ isGranted: true, code: 'PROVIDER-MANAGEMENT-READ' }],
          },
        ],
      },
      {
        name: 'Network Admin',
        code: 'NETWORK-ADMIN',
        created: assigner,
        updated: assigner,
        roleId: randomUUID(),
        resources: [
          { code: 'SETTING', permissions: [], isGranted: true },
          {
            isGranted: true,
            parent: 'SETTING',
            code: 'ACTIVITY-LOG',
            permissions: [{ isGranted: true, code: 'ACTIVITY-LOG-READ' }],
          },
          {
            isGranted: true,
            code: 'ORGANIZATION-MANAGEMENT',
            permissions: [{ isGranted: true, code: 'ORGANIZATION-MANAGEMENT-READ' }],
          },
          {
            isGranted: true,
            code: 'NETWORK-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'NETWORK-MANAGEMENT-READ' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-UPDATE-SETTINGS' },
              { isGranted: true, code: 'NETWORK-MANAGEMENT-INVITE-ORGANIZATION' },
            ],
          },
          {
            isGranted: true,
            code: 'FACILITY-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'FACILITY-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-READ' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'FACILITY-MANAGEMENT-ASSOCIATE-FACILITY' },
            ],
          },
          {
            isGranted: true,
            code: 'PHYSICIAN-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-READ' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-DELETE' },
              { isGranted: true, code: 'PHYSICIAN-MANAGEMENT-ASSOCIATE-PHYSICIAN' },
            ],
          },
          {
            isGranted: true,
            code: 'SERVICE-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'SERVICE-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-READ' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'SERVICE-MANAGEMENT-DELETE' },
            ],
          },
          {
            isGranted: true,
            code: 'PRICING-MANAGEMENT',
            permissions: [
              { isGranted: true, code: 'PRICING-MANAGEMENT-CREATE' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-READ' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-UPDATE' },
              { isGranted: true, code: 'PRICING-MANAGEMENT-DELETE' },
            ],
          },
          {
            isGranted: true,
            code: 'PROVIDER-MANAGEMENT',
            permissions: [{ isGranted: true, code: 'PROVIDER-MANAGEMENT-READ' }],
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
        $in: ['SUPER-ADMIN', 'ORGANIZATION-ADMIN', 'NETWORK-ADMIN'],
      },
    });
  }
}

export default Migration;
