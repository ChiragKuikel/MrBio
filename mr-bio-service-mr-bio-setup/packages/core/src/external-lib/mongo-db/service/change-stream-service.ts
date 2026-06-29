import { Logger } from '../../../shared';
import { MongoConnection } from '../mongodb-connection';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { MongoClient, ChangeStream, ChangeStreamDocument, ObjectId } from 'mongodb';

@Injectable()
export class ChangeStreamService implements OnModuleInit {
  private changeStream: ChangeStream;
  private client: MongoClient;

  constructor(
    private readonly connection: MongoConnection,
    private readonly logger: Logger
  ) {
    this.client = this.connection.mongoClient!;
  }

  async onModuleInit() {
    try {
      if (!this.client) {
        this.client = this.connection.mongoClient!;
      }

      const db = this.connection.dbInstance;
      if (!db) {
        throw new Error('Database instance not initialized');
      }

      this.changeStream = db.watch([], {
        fullDocument: 'updateLookup',
      });

      this.changeStream.on('change', (change: ChangeStreamDocument<Document>) => {
        const operationType = change.operationType;

        // Skip operations that don't modify documents
        if (!['insert', 'update', 'delete'].includes(operationType)) return;

        // Type assertion for document operations that have ns
        const collection = (change as any).ns?.coll || 'unknown';
        const documentId = ('documentKey' in change && change.documentKey._id) || null;
        const fullDocument = 'fullDocument' in change ? change.fullDocument : null;

        this.logger.info(`Change detected in collection ${collection}`);
        this.logger.info(`Operation: ${operationType}`);

        switch (operationType) {
          case 'insert':
            this.handleInsert(collection, fullDocument);
            break;
          case 'update':
            this.handleUpdate(collection, documentId, fullDocument);
            break;
          case 'delete':
            this.handleDelete(collection, documentId);
            break;
        }
      });

      this.logger.info('Change stream initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize change stream', error);
    }
  }

  private handleInsert(collection: string, document: any) {
    this.logger.info(`New document inserted in ${collection}:`); //, document
  }

  private handleUpdate(collection: string, id: ObjectId | null, updatedDocument: any) {
    this.logger.info(`Document updated in ${collection}:`); //, { updatedDocument, id: id?.toString() }
  }

  private handleDelete(collection: string, id: ObjectId | null) {
    this.logger.info(`Document deleted from ${collection}:`); //, { id: id?.toString() }
  }

  async onModuleDestroy() {
    if (this.changeStream) {
      await this.changeStream.close();
      this.logger.info('Change stream closed');
    }
    await this.client.close();
  }
}
