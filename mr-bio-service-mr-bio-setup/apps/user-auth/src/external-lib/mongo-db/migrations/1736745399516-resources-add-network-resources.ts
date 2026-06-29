import { randomUUID } from 'crypto';
import { IMigration, DB } from 'db-mongo-migration';
import { ResourceSchema } from '../../../app/authorization/repository/schemas/resource-schema';

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
    const data: ResourceSchema[] = [
      {
        icon: '',
        order: 5,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'ORGANIZATION-MANAGEMENT',
        name: 'Organization Management',
        resourceId: randomUUID(),
        routePath: '/organization-management',
        permissions: [
          {
            label: 'Create new organization',
            code: 'ORGANIZATION-MANAGEMENT-CREATE',
            description: 'Ability to a create new organization.',
          },
          {
            label: 'Read organizations',
            code: 'ORGANIZATION-MANAGEMENT-READ',
            description: 'Ability to access all organizations.',
          },
          {
            label: 'Update organization',
            code: 'ORGANIZATION-MANAGEMENT-UPDATE',
            description: 'Ability to update an organization.',
          },
          {
            label: 'Delete organization',
            code: 'ORGANIZATION-MANAGEMENT-DELETE',
            description: 'Ability to delete an organization.',
          },
        ],
      },
      {
        icon: '',
        order: 6,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'NETWORK-MANAGEMENT',
        name: 'Network Management',
        resourceId: randomUUID(),
        routePath: '/network-management',
        permissions: [
          {
            label: 'Create new network',
            code: 'NETWORK-MANAGEMENT-CREATE',
            description: 'Ability to create a new network.',
          },
          {
            label: 'Read networks',
            code: 'NETWORK-MANAGEMENT-READ',
            description: 'Ability to access all networks.',
          },
          {
            label: 'Update network',
            code: 'NETWORK-MANAGEMENT-UPDATE',
            description: 'Ability to update a network.',
          },
          {
            label: 'Delete network',
            code: 'NETWORK-MANAGEMENT-DELETE',
            description: 'Ability to delete a network.',
          },
          {
            label: 'Update network settings',
            code: 'NETWORK-MANAGEMENT-UPDATE-SETTINGS',
            description: "Ability to update a network's settings.",
          },
          {
            label: 'Invite organization',
            code: 'NETWORK-MANAGEMENT-INVITE-ORGANIZATION',
            description: 'Ability to invite an organization to a network.',
          },
        ],
      },
      {
        icon: '',
        order: 7,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'FACILITY-MANAGEMENT',
        name: 'Facility Management',
        resourceId: randomUUID(),
        routePath: '/facility-management',
        permissions: [
          {
            label: 'Create new facility',
            code: 'FACILITY-MANAGEMENT-CREATE',
            description: 'Ability to create a new facility.',
          },
          {
            label: 'Read facilities',
            code: 'FACILITY-MANAGEMENT-READ',
            description: 'Ability to access all facilities.',
          },
          {
            label: 'Update facility',
            code: 'FACILITY-MANAGEMENT-UPDATE',
            description: 'Ability to update a facility.',
          },
          {
            label: 'Delete facility',
            code: 'FACILITY-MANAGEMENT-DELETE',
            description: 'Ability to delete a facility.',
          },
          {
            label: 'Associate facility',
            code: 'FACILITY-MANAGEMENT-ASSOCIATE-PHYSICIAN',
            description: 'Ability to associate a facility with a physician.',
          },
        ],
      },
      {
        icon: '',
        order: 8,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'PHYSICIAN-MANAGEMENT',
        name: 'Physician Management',
        resourceId: randomUUID(),
        routePath: '/physician-management',
        permissions: [
          {
            label: 'Create new physician',
            code: 'PHYSICIAN-MANAGEMENT-CREATE',
            description: 'Ability to create a new physician.',
          },
          {
            label: 'Read physicians',
            code: 'PHYSICIAN-MANAGEMENT-READ',
            description: 'Ability to access all physicians.',
          },
          {
            label: 'Update physician',
            code: 'PHYSICIAN-MANAGEMENT-UPDATE',
            description: 'Ability to update a physician.',
          },
          {
            label: 'Delete physician',
            code: 'PHYSICIAN-MANAGEMENT-DELETE',
            description: 'Ability to delete a physician.',
          },
        ],
      },
      {
        icon: '',
        order: 9,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'SERVICE-MANAGEMENT',
        name: 'Service Management',
        resourceId: randomUUID(),
        routePath: '/service-management',
        permissions: [
          {
            label: 'Create new service',
            code: 'SERVICE-MANAGEMENT-CREATE',
            description: 'Ability to create a new service.',
          },
          {
            label: 'Read services',
            code: 'SERVICE-MANAGEMENT-READ',
            description: 'Ability to access all services.',
          },
          {
            label: 'Update service',
            code: 'SERVICE-MANAGEMENT-UPDATE',
            description: 'Ability to update a service.',
          },
          {
            label: 'Delete service',
            code: 'SERVICE-MANAGEMENT-DELETE',
            description: 'Ability to delete a service.',
          },
        ],
      },
      {
        icon: '',
        order: 10,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'PRICING-MANAGEMENT',
        name: 'Pricing Management',
        resourceId: randomUUID(),
        routePath: '/PRICING-MANAGEMENT',
        permissions: [
          {
            label: 'Create new pricing',
            code: 'PRICING-MANAGEMENT-CREATE',
            description: 'Ability to create a new pricing.',
          },
          {
            label: 'Read pricings',
            code: 'PRICING-MANAGEMENT-READ',
            description: 'Ability to access all pricings.',
          },
          {
            label: 'Update pricing',
            code: 'PRICING-MANAGEMENT-UPDATE',
            description: 'Ability to update an pricing.',
          },
          {
            label: 'Delete pricing',
            code: 'PRICING-MANAGEMENT-DELETE',
            description: 'Ability to delete an pricing.',
          },
        ],
      },
      {
        icon: '',
        order: 12,
        activeIcon: '',
        created: assigner,
        updated: assigner,
        code: 'PROVIDER-MANAGEMENT',
        name: 'Provider Management',
        resourceId: randomUUID(),
        routePath: '/provider-management',
        permissions: [
          {
            label: 'Read providers',
            code: 'PROVIDER-MANAGEMENT-READ',
            description: 'Ability to access all providers.',
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
        $in: [
          'ORGANIZATION-MANAGEMENT',
          'NETWORK-MANAGEMENT',
          'FACILITY-MANAGEMENT',
          'PHYSICIAN-MANAGEMENT',
          'SERVICE-MANAGEMENT',
          'PRICING-MANAGEMENT',
        ],
      },
    });
  }
}

export default Migration;
