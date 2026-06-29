import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import {
  assignerValidator,
  dbMaxLengthValidations,
  phoneValueValidator,
} from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.CLIENT;

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
          required: ['clientId', 'clientSecrets', 'organization', 'tokens', 'created', 'updated'],
          properties: {
            clientId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'must be a string and is required',
            },
            clientSecrets: {
              bsonType: 'array',
              items: {
                type: 'object',
                required: ['clientSecretId', 'name', 'value', 'allowedSources', 'created'],
                properties: {
                  clientSecretId: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.UUID,
                    description: 'must be a string and is required',
                  },
                  name: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string and is required',
                  },
                  value: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                  },
                  allowedSources: {
                    bsonType: 'array',
                    items: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    },
                    description: 'must be an array of strings',
                  },
                  lastUsedAt: {
                    bsonType: ['date', 'null'],
                    description: 'must be a date or null',
                  },
                  usageCount: {
                    bsonType: ['number', 'null'],
                    description: 'must be a number or null',
                  },
                  created: {
                    ...assignerValidator,
                  },
                  updated: {
                    ...assignerValidator,
                    bsonType: ['object', 'null'],
                  },
                  revoked: {
                    ...assignerValidator,
                    bsonType: ['object', 'null'],
                  },
                },
              },
            },
            organization: {
              bsonType: 'object',
              required: ['id', 'code', 'name'],
              properties: {
                id: {
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
              },
            },
            tokens: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                required: [
                  'tokenId',
                  'clientSecretId',
                  'allowedSources',
                  'roles',
                  'issuedAt',
                  'expiresAt',
                ],
                properties: {
                  tokenId: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.UUID,
                    description: 'must be a string and is required',
                  },
                  clientSecretId: {
                    bsonType: 'string',
                    maxLength: dbMaxLengthValidations.UUID,
                    description: 'must be a string and is required',
                  },
                  allowedSources: {
                    bsonType: 'array',
                    items: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    },
                    description: 'must be an array of strings',
                  },
                  roles: {
                    bsonType: 'array',
                    items: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    },
                    description: 'must be an array of strings',
                  },
                  networkIds: {
                    bsonType: ['array', 'null'],
                    items: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    },
                    description: 'must be an array of strings or null',
                  },
                  issuedAt: {
                    bsonType: 'date',
                    description: 'must be a date and is required',
                  },
                  expiresAt: {
                    bsonType: 'date',
                    description: 'must be a date and is required',
                  },
                  lastUsedAt: {
                    bsonType: ['date', 'null'],
                    description: 'must be a date or null',
                  },
                  revokedAt: {
                    bsonType: ['date', 'null'],
                    description: 'must be a date or null',
                  },
                  usageCount: {
                    bsonType: ['number', 'null'],
                    description: 'must be a number or null',
                  },
                },
              },
            },
            contacts: {
              bsonType: ['array', 'null'],
              items: {
                bsonType: 'object',
                required: ['type'],
                properties: {
                  name: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                    description: 'must be a string or null',
                  },
                  phone: {
                    ...phoneValueValidator,
                    bsonType: ['object', 'null'],
                  },
                  email: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.EMAIL,
                    description: 'must be a string or null',
                  },
                  type: {
                    bsonType: 'string',
                    enum: ['support', 'billing', 'developer'],
                    description: 'must be a string and is required',
                  },
                },
              },
              description: 'must be an array of objects or null',
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
