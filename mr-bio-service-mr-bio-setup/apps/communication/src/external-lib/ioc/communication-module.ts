import { Module } from '@nestjs/common';
import { MessageModel } from '../../app/repository/models/message-model';
import { MessageServiceImpl } from '../../app/domain/message-service-impl';
import { MessageService } from '../../app/domain/abstractions/message-service';
import { MessageRepositoryImpl } from '../../app/repository/message-repository-impl';
import { UserAuthMessageHandler } from '../../app/messaging/user-auth-message-handler';
import { MessageRepository } from '../../app/repository/abstractions/message-repository';
import { MessageTemplateModel } from '../../app/repository/models/message-template-model';
import { MessagePersistenceMapper } from '../../app/repository/mappers/message-persistence-mapper';
import { MessageTemplateRepositoryImpl } from '../../app/repository/message-template-repository-impl';
import { MessageTemplateRepository } from '../../app/repository/abstractions/message-template-repository';
import { MessageTemplatePersistenceMapper } from '../../app/repository/mappers/message-template-persistence-mapper';

@Module({
  controllers: [UserAuthMessageHandler],
  providers: [
    {
      provide: MessageService,
      useClass: MessageServiceImpl,
    },
    {
      provide: MessageTemplateRepository,
      useClass: MessageTemplateRepositoryImpl,
    },
    MessageTemplateModel,
    MessageTemplatePersistenceMapper,
    {
      provide: MessageRepository,
      useClass: MessageRepositoryImpl,
    },
    MessageModel,
    MessagePersistenceMapper,
  ],
})
export class CommunicationModule {}
