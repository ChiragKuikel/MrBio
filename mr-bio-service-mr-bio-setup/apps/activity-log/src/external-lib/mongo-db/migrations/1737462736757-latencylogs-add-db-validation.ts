import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';

class Migration implements IMigration {
  private collectionName = dbCollections.LATENCY_LOG;
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
            'latencyLogId',
            'timestamp',
            'endpoint',
            'method',
            'responseTimeMs',
            'statusCode',
            'environment',
            'application',
          ],
          properties: {
            latencyLogId: {
              bsonType: 'string',
              description: 'Unique identifier for the latency log.',
            },
            timestamp: {
              bsonType: 'date',
              description: 'Must be a valid ISODate representing the API call timestamp.',
            },
            endpoint: {
              bsonType: 'string',
              description: 'Must be a string representing the API endpoint.',
            },
            method: {
              bsonType: 'string',
              enum: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
              description: 'Must be a valid HTTP method.',
            },
            responseTimeMs: {
              bsonType: 'number',
              description: 'Must be a number representing response time in milliseconds.',
            },
            statusCode: {
              bsonType: 'number',
              description: 'Must be a number representing the HTTP status code.',
            },
            environment: {
              bsonType: 'string',
              description:
                'Must be a string representing the environment (e.g., dev, staging, production).',
            },
            application: {
              bsonType: 'object',
              required: ['name', 'id'],
              properties: {
                name: {
                  bsonType: 'string',
                  description: 'Must be a string representing the application name.',
                },
                id: {
                  bsonType: 'string',
                  description: 'Must be a string representing the application ID.',
                },
              },
            },
            request: {
              bsonType: ['object', 'null'],
              properties: {
                headers: {
                  bsonType: ['object', 'null'],
                  description: 'Optional object capturing request headers.',
                },
                queryParams: {
                  bsonType: ['object', 'null'],
                  description: 'Optional object capturing query parameters.',
                },
                body: {
                  bsonType: ['object', 'null'],
                  description: 'Optional object capturing the request payload.',
                },
              },
              description: 'Optional object capturing additional request details.',
            },
            user: {
              bsonType: ['object', 'null'],
              properties: {
                userId: {
                  bsonType: ['string', 'null'],
                  description: 'Optional string representing the unique user ID.',
                },
                roles: {
                  bsonType: 'array',
                  items: {
                    bsonType: 'string',
                  },
                  description: 'Optional array of strings representing user roles or permissions.',
                },
                ipAddress: {
                  bsonType: 'string',
                  description: "Optional string representing the user's IP address.",
                },
              },
              description: 'Optional object capturing user-related information.',
            },
            meta: {
              bsonType: ['object', 'null'],
              properties: {
                tags: {
                  bsonType: ['array', 'null'],
                  items: {
                    bsonType: 'string',
                  },
                  description: 'Optional array of strings for classification tags.',
                },
                correlationId: {
                  bsonType: ['string', 'null'],
                  description: 'Optional string representing the correlation ID for tracing.',
                },
              },
              description: 'Optional object capturing additional metadata.',
            },
          },
        },
      },
      validationLevel: 'moderate', // "moderate" or "strict" depending on enforcement needs
      validationAction: 'error', // Enforces validation rules
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
