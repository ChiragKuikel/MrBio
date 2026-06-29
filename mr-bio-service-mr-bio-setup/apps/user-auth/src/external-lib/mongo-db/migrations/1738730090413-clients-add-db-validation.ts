import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import {
  assignerValidator,
  dbMaxLengthValidations,
  phoneValueValidator,
} from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.CLIENT;

  MAX_LENGTH = { ...dbMaxLengthValidations };

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
          required: ['clientId', 'organization', 'created', 'updated'],
          properties: {
            clientId: {
              bsonType: 'string',
              description: 'must be a string and is required',
              maxLength: this.MAX_LENGTH.UUID,
            },
            clientSecrets: {
              bsonType: ['array', 'null'],
              items: {
                bsonType: 'object',
                required: ['clientSecretId', 'name', 'value', 'created', 'allowedSources'],
                properties: {
                  clientSecretId: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    maxLength: this.MAX_LENGTH.UUID,
                  },
                  name: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    maxLength: this.MAX_LENGTH.GENERAL_STRING,
                  },
                  value: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    maxLength: this.MAX_LENGTH.GENERAL_STRING,
                  },
                  allowedSources: {
                    bsonType: 'array',
                    description: 'must be an array and is required',
                    items: {
                      bsonType: 'string',
                      description: 'must be a string and is required',
                      maxLength: this.MAX_LENGTH.GENERAL_STRING,
                    },
                  },
                  created: {
                    ...assignerValidator,
                  },
                  updated: {
                    ...assignerValidator,
                  },
                  revoked: {
                    ...assignerValidator,
                  },
                },
              },
            },
            organization: {
              bsonType: 'object',
              required: ['id', 'name', 'code'],
              properties: {
                id: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                  maxLength: this.MAX_LENGTH.UUID,
                },
                name: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                  maxLength: this.MAX_LENGTH.GENERAL_STRING,
                },
                code: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                  maxLength: this.MAX_LENGTH.GENERAL_STRING,
                },
              },
            },
            tokens: {
              bsonType: ['array', 'null'],
              description: 'must be an array and is required',
              items: {
                bsonType: 'object',
                required: ['tokenId', 'clientSecretId', 'issuedAt', 'expiresAt'],
                properties: {
                  tokenId: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    maxLength: this.MAX_LENGTH.UUID,
                  },
                  clientSecretId: {
                    bsonType: 'string',
                    description: 'must be a string and is required',
                    maxLength: this.MAX_LENGTH.UUID,
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
                    description: 'must be a date',
                  },
                  revokedAt: {
                    bsonType: ['date', 'null'],
                    description: 'must be a date',
                  },
                  usageCount: {
                    bsonType: ['number', 'null'],
                    description: 'must be a number',
                  },
                },
              },
            },
            contacts: {
              bsonType: ['array', 'null'],
              items: {
                bsonType: 'object',
                required: ['name', 'type'],
                properties: {
                  name: {
                    bsonType: 'string',
                    description: 'Name of the contact.',
                    maxLength: this.MAX_LENGTH.GENERAL_STRING,
                  },
                  phone: { ...phoneValueValidator, bsonType: ['object', 'null'] },
                  email: {
                    bsonType: ['string', 'null'],
                    description: 'Email address.',
                    maxLength: dbMaxLengthValidations.EMAIL,
                  },
                  type: {
                    enum: ['support', 'developer', 'billing'],
                    description: "Type must be one of 'support', 'developer', or 'billing'.",
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
      validationLevel: 'strict',
      validationAction: 'error',
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

  /**
   * Reverse the migrations.
   */
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
