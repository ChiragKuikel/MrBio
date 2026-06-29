import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { dbMaxLengthValidations } from '@mr-bio/core/external-lib';
import { MessageStatus } from '../../../shared/enums/message-status';
import { MessageMethod } from '../../../app/domain/core/entities/message-template';

class Migration implements IMigration {
  collectionName = dbCollections.MESSAGE;

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
          required: ['messageId', 'messageTemplateId', 'receivers', 'messageContent', 'status'],
          properties: {
            messageId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'Unique identifier for the message.',
            },
            messageTemplateId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'Unique identifier of the message template used.',
            },
            refId: {
              bsonType: ['string', 'null'],
              maxLength: dbMaxLengthValidations.UUID,
              description: 'Unique identifier of the reference object.',
            },
            sender: {
              bsonType: ['object', 'null'],
              required: ['email'],
              properties: {
                name: {
                  bsonType: ['string', 'null'],
                  maxLength: dbMaxLengthValidations.GENERAL_STRING,
                },
                email: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.EMAIL,
                },
              },
            },
            receivers: {
              bsonType: 'array',
              items: {
                bsonType: 'object',
                properties: {
                  name: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                  },
                  email: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.EMAIL,
                  },
                  phone: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.PHONE,
                  },
                  deviceToken: {
                    bsonType: ['string', 'null'],
                    maxLength: dbMaxLengthValidations.GENERAL_STRING,
                  },
                },
              },
            },
            messageContent: {
              bsonType: 'object',
              required: ['method', 'subject', 'body'],
              properties: {
                method: {
                  bsonType: 'string',
                  enum: [MessageMethod.EMAIL, MessageMethod.SMS],
                },
                subject: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_STRING,
                },
                body: {
                  bsonType: 'string',
                  maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
                },
                attachments: {
                  bsonType: ['array', 'null'],
                  items: {
                    bsonType: 'object',
                  },
                },
              },
            },
            status: {
              bsonType: 'string',
              enum: [
                MessageStatus.NEW,
                MessageStatus.QUEUE,
                MessageStatus.IN_PROGRESS,
                MessageStatus.SENT,
                MessageStatus.FAILED,
              ],
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
