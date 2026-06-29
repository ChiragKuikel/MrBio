import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { assignerValidator, dbMaxLengthValidations } from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.RESOURCE;

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
          required: ['resourceId', 'code', 'name', 'order', 'permissions'],
          properties: {
            resourceId: {
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
            description: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
              description: 'must be a string',
            },
            routePath: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            isMenu: {
              bsonType: ['bool', 'null'],
              description: 'must be a bool',
            },
            icon: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            activeIcon: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            order: {
              bsonType: 'number',
              description: 'must be a number',
            },
            parent: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string',
            },
            permissions: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: ['code', 'label'],
                properties: {
                  code: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string and is required',
                  },
                  label: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string and is required',
                  },
                  isRequiredForAdmin: {
                    bsonType: ['bool', 'null'],
                    description: 'must be a bool',
                  },
                  description: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
                    description: 'must be a string',
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
