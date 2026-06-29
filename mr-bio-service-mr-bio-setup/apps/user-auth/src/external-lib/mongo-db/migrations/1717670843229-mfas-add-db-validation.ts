import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { assignerValidator, dbMaxLengthValidations } from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.MFA;

  /**
   * Run the migrations.
   */
  async up(db: DB) {
    const collections = await db.runCommand({ listCollections: 1 });
    const collectionExists = collections.cursor.firstBatch.some(
      (col: any) => col.name === this.collectionName
    );

    const validationRules = {
      validator: {
        $jsonSchema: {
          bsonType: 'object',
          required: ['mfaId', 'code', 'expirationTime', 'type', 'action'],
          properties: {
            mfaId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'must be a string and is required',
            },
            code: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string and is required',
            },
            expirationTime: {
              bsonType: 'date',
              description: 'must be a date and is required',
            },
            isUsed: {
              bsonType: ['bool', 'null'],
              description: 'must be a bool',
            },
            type: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            action: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            isVerified: {
              bsonType: ['bool', 'null'],
              description: 'must be a bool',
            },
            created: {
              ...assignerValidator,
            },
            updated: {
              ...assignerValidator,
            },
          },
        },
      },
    };

    if (collectionExists) {
      await db.runCommand({
        collMod: this.collectionName,
        ...validationRules,
      });
    } else {
      await db.createCollection(this.collectionName, validationRules);
    }
  }

  async down(db: DB) {
    await db.runCommand({
      collMod: this.collectionName,
      validator: {},
      validationLevel: 'off',
      validationAction: 'warn',
    });
  }
}

export default Migration;
