import { dbCollections } from '../db-collections';
import { IMigration, DB } from 'db-mongo-migration';
import { assignerValidator, dbMaxLengthValidations } from '@mr-bio/core/external-lib';
import { MessageMethod, TemplateType } from '../../../app/domain/core/entities/message-template';

class Migration implements IMigration {
  collectionName = dbCollections.MESSAGE_TEMPLATE;

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
            'messageTemplateId',
            'code',
            'name',
            'description',
            'messages',
            'type',
            'triggerPoints',
          ],
          properties: {
            messageTemplateId: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.UUID,
              description: 'Unique identifier for the network provider.',
            },
            code: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'Unique code for the message template.',
            },
            type: {
              bsonType: 'string',
              enum: [TemplateType.SYSTEM, TemplateType.USER],
              description: 'Type of the message template.',
            },
            name: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_STRING,
              description: 'Name of the message template.',
            },
            description: {
              bsonType: 'string',
              maxLength: dbMaxLengthValidations.GENERAL_LONG_STRING,
              description: 'Description of the message template.',
            },
            messages: {
              bsonType: 'array',
              items: {
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
                  },
                  attachments: {
                    bsonType: ['array', 'null'],
                    items: {
                      bsonType: 'object',
                    },
                  },
                },
              },
            },
            triggerPoints: {
              bsonType: 'array',
              items: {
                bsonType: 'string',
                maxLength: dbMaxLengthValidations.GENERAL_STRING,
              },
            },
            variables: {
              bsonType: ['array', 'null'],
              items: {
                bsonType: 'string',
              },
            },
            created: { ...assignerValidator },
            updated: { ...assignerValidator },
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
