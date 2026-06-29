import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { assignerValidator } from '@mr-bio/core/external-lib';

class Migration implements IMigration {
  collectionName = dbCollections.ACTIVITY_LOG;

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
          required: ['activityLogId', 'event', 'log'],
          properties: {
            activityLogId: {
              bsonType: 'string',
              description: 'Unique identifier for the activity log.',
            },
            event: {
              bsonType: 'object',
              description: 'The event object.',
              required: ['type'],
              properties: {
                type: {
                  bsonType: 'string',
                  description: 'The type of the event.',
                },
                subType: {
                  bsonType: ['string', 'null'],
                  description: 'The sub-type of the event.',
                },
              },
            },
            log: {
              bsonType: 'object',
              description: 'The log object.',
              required: ['module', 'attributes'],
              properties: {
                module: {
                  bsonType: 'string',
                  description: 'The module of the log.',
                },
                subModule: {
                  bsonType: ['string', 'null'],
                  description: 'The sub-module of the log.',
                },
                note: {
                  bsonType: ['string', 'null'],
                  description: 'The note of the log.',
                },
                attributes: {
                  bsonType: 'object',
                  description: 'The attributes of the log.',
                },
                type: {
                  bsonType: ['string', 'null'],
                  enum: ['INFORMATION', 'WARNING', 'ERROR'],
                  description: 'The type of the log.',
                },
              },
            },
            userVisibility: {
              bsonType: ['bool', 'null'],
              description: 'The user visibility of the log.',
            },
            severity: {
              bsonType: ['string', 'null'],
              enum: ['HIGH', 'MEDIUM', 'LOW'],
              description: 'The severity of the log.',
            },
            tags: {
              bsonType: ['array', 'null'],
              description: 'The tags of the log.',
              items: {
                bsonType: 'string',
                description: 'The tag of the log.',
              },
            },
            logged: {
              ...assignerValidator,
              bsonType: ['object', 'null'],
              description: 'The user who logged the log.',
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
