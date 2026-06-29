import { IMigration, DB } from 'db-mongo-migration';

class Migration implements IMigration {
  collectionName = 'userAuth_roles';

  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const data = {
      isGranted: true,
      code: 'CLIENT-MANAGEMENT',
      permissions: [
        { isGranted: true, code: 'CLIENT-MANAGEMENT-CREATE' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-READ' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-UPDATE' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-DELETE' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-CREATE-CLIENT-SECRET' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-REVOKE-CLIENT-SECRET' },
        { isGranted: true, code: 'CLIENT-MANAGEMENT-CREATE-ACCESS-TOKEN' },
      ],
    };

    db.updateOne(
      this.collectionName,
      { code: 'ORGANIZATION-ADMIN' },
      { $push: { resources: data } as any }
    );
  }

  /**
   * Reverse the migrations.
   */
  async down(db: DB) {
    await db.updateOne(
      this.collectionName,
      { code: 'ORGANIZATION-ADMIN' },
      { $pull: { resources: { code: 'CLIENT-MANAGEMENT' } } as any }
    );
  }
}

export default Migration;
