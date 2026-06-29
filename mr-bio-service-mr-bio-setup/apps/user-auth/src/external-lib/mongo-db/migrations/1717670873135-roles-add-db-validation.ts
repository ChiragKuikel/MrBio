import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { assignerValidator, dbMaxLengthValidations } from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.ROLE;

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

          required: ['roleId', 'code', 'name', 'resources'],
          properties: {
            roleId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'must be a string and is required',
            },
            code: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string and is required',
            },
            name: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string and is required',
            },
            resources: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['code', 'isGranted', 'permissions'],
                properties: {
                  code: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string and is required',
                  },
                  parent: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string',
                  },
                  isGranted: {
                    bsonType: 'bool',
                    description: 'must be a bool and is required',
                  },
                  permissions: {
                    bsonType: 'array',
                    items: {
                      bsonType: 'object',
                      required: ['code', 'isGranted'],
                      properties: {
                        code: {
                          bsonType: 'string',
                          maxLength: dbMaxLengthValidations.GENERAL_STRING,
                          description: 'must be a string and is required',
                        },
                        isGranted: {
                          bsonType: 'bool',
                          description: 'must be a bool and is required',
                        },
                      },
                    },
                  },
                },
              },
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
