import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { dbMaxLengthValidations } from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.EXCEPTION_LOG;

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
            'exceptionLogId',
            'timestamp',
            'application',
            'environment',
            'level',
            'message',
            'request',
            'exception',
          ],
          properties: {
            exceptionLogId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'Unique identifier for the network provider.',
            },
            timestamp: {
              bsonType: 'date',
              description: 'Must be an ISODate and is required',
            },
            application: {
              bsonType: 'object',
              required: ['name', 'id'],
              properties: {
                name: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_STRING,
                  description: 'Must be a string and is required',
                },
                id: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.UUID,
                  description: 'Must be a string and is required',
                },
              },
            },
            environment: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'Must be a string and is required',
            },
            level: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'Must be a string and is required',
            },
            message: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
              description: 'Must be a string and is required',
            },
            request: {
              bsonType: 'object',
              properties: {
                method: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_STRING,
                  description: 'Must be a string',
                },
                url: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
                  description: 'Must be a string',
                },
                headers: {
                  bsonType: 'object',
                  description: 'Must be an object',
                },
                body: {
                  bsonType: 'object',
                  description: 'Must be an object',
                },
                queryParams: {
                  bsonType: 'object',
                  description: 'Must be an object',
                },
                ipAddress: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_STRING,
                  description: 'Must be a string',
                },
              },
            },
            response: {
              bsonType: ['object', 'null'],
              properties: {
                statusCode: {
                  bsonType: 'int',
                  description: 'Must be a number',
                },
                headers: {
                  bsonType: 'object',
                  description: 'Must be an object',
                },
                body: {
                  bsonType: 'object',
                  description: 'Must be an object',
                },
              },
            },
            user: {
              bsonType: ['object', 'null'],
              properties: {
                userId: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                email: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                roles: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'string',
                  },
                  description: 'Must be an array of strings',
                },
              },
            },
            exception: {
              bsonType: 'object',
              properties: {
                type: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                message: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                stackTrace: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
              },
            },
            meta: {
              bsonType: ['object', 'null'],
              properties: {
                service: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                host: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
                tags: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'string',
                  },
                  description: 'Must be an array of strings',
                },
                correlationId: {
                  bsonType: 'string',
                  description: 'Must be a string',
                },
              },
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
