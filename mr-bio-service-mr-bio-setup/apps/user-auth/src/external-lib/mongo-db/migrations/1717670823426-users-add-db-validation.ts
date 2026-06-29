import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import {
  addressValidator,
  assignerValidator,
  dbMaxLengthValidations,
  phoneValidator,
} from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.USER;

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
          required: [
            'userId',
            'email',
            'username',
            'demographic',
            'status',
            'association',
            'organization',
            'created',
            'updated',
          ],
          properties: {
            userId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'must be a string and is required',
            },
            email: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.EMAIL,
              description: 'must be a string and is required',
            },
            username: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'must be a string and is required',
            },
            phones: {
              ...phoneValidator,
              bsonType: ['array', 'null'],
            },
            security: {
              bsonType: ['object', 'null'],
              properties: {
                password: {
                  bsonType: ['string', 'null'],
                  description: 'must be a string',
                },
                passwordHistory: {
                  bsonType: ['array', 'null'],
                  description: 'must be an array',
                  items: {
                    bsonType: 'string',
                  },
                },
                enableMFA: {
                  bsonType: ['bool', 'null'],
                  description: 'must be a bool',
                },
                loginAttempts: {
                  bsonType: ['number', 'null'],
                  description: 'must be a number',
                },
                lastLoginDate: {
                  bsonType: ['date', 'null'],
                  description: 'must be a date',
                },
              },
            },
            demographic: {
              bsonType: ['object'],
              required: ['name', 'gender'],
              properties: {
                name: {
                  bsonType: 'object',
                  required: ['firstName', 'lastName'],
                  properties: {
                    firstName: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                      description: 'must be a string and is required',
                    },
                    middleName: {
                      bsonType: ['string', 'null'],
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                      description: 'must be a string',
                    },
                    lastName: {
                      bsonType: 'string',
                      maxLength: dbMaxLengthValidations.GENERAL_STRING,
                      description: 'must be a string and is required',
                    },
                  },
                },
                gender: {
                  bsonType: ['string'],
                  enum: ['male', 'female', 'other'],
                  description: 'must be one of the predefined enum values and is required',
                },
                dob: {
                  bsonType: ['string', 'null'],
                  description: 'must be a string',
                },
                address: {
                  ...addressValidator,
                  bsonType: ['object', 'null'],
                },
              },
            },
            status: {
              bsonType: ['string'],
              enum: ['active', 'inactive', 'pending_activation'],
              description: 'must be one of the predefined enum values and is required',
            },
            association: {
              bsonType: ['object'],
              properties: {
                roles: {
                  bsonType: ['array', 'null'],
                  items: {
                    bsonType: 'string',
                  },
                },
                resources: {
                  bsonType: ['array', 'null'],
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
                        description: 'must be a string',
                      },
                      isGranted: {
                        bsonType: 'bool',
                        description: 'must be a bool',
                      },
                      permissions: {
                        bsonType: ['array', 'null'],
                        description: 'must be an array',
                        items: {
                          bsonType: 'object',
                          required: ['isGranted', 'code'],
                          properties: {
                            isGranted: {
                              bsonType: 'bool',
                              description: 'must be a bool',
                            },
                            code: {
                              bsonType: 'string',
                              maxLength: dbMaxLengthValidations.GENERAL_STRING,
                              description: 'must be a string and is required',
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
            organization: {
              bsonType: ['object'],
              required: ['id', 'code', 'name'],
              properties: {
                id: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                },
                code: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                },
                name: {
                  bsonType: 'string',
                  description: 'must be a string and is required',
                },
              },
            },
            networks: {
              bsonType: ['array', 'null'],
              items: {
                bsonType: 'object',
                required: ['id', 'code', 'name', 'status', 'created', 'updated'],
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
                  status: {
                    bsonType: 'string',
                    enum: ['active', 'inactive'],
                    description: 'must be one of the predefined enum values and is required',
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
