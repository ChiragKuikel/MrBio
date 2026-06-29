import { BaseRepository } from '@mr-bio/core/shared';
import { Message } from '../../domain/core/entities/message';

export abstract class MessageRepository extends BaseRepository<Message> {}
