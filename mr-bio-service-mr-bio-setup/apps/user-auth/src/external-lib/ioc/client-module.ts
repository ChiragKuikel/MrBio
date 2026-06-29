import { Module } from '@nestjs/common';
import { AuthorizationModule } from './authorization-module';
import { EntityActivityLogPublisherFactory } from '@mr-bio/core/shared';
import { ClientModel } from '../../app/client/repository/models/client-model';
import { ClientServiceImpl } from '../../app/client/domain/client-service-impl';
// import { ClientController } from '../../app/client/controllers/client-controller';
import { ClientService } from '../../app/client/domain/abstractions/client-service';
import { ClientRepositoryImpl } from '../../app/client/repository/client-repository-impl';
import { ClientPresenter } from '../../app/client/presenters/abstractions/client-presenter';
import { ClientRepository } from '../../app/client/repository/abstractions/client-repository';
import { DefaultClientPresenter } from '../../app/client/presenters/default-client-presenter';
import { ClientPersistenceMapper } from '../../app/client/repository/mappers/client-persistence-mapper';
import { ClientServiceActivityLogDecorator } from '../../app/client/decorators/client-service-activity-log-decorator';

@Module({
  // controllers: [ClientController],
  imports: [AuthorizationModule],
  providers: [
    ClientServiceImpl,
    {
      provide: ClientService,
      inject: [ClientServiceImpl, EntityActivityLogPublisherFactory],
      useFactory: (
        ClientServiceImpl: ClientServiceImpl,
        entityActivityLogPublisherFactory: EntityActivityLogPublisherFactory
      ) => {
        return new ClientServiceActivityLogDecorator(
          ClientServiceImpl as unknown as ClientService,
          entityActivityLogPublisherFactory
        );
      },
    },
    {
      provide: ClientRepository,
      useClass: ClientRepositoryImpl,
    },
    {
      provide: ClientPresenter,
      useClass: DefaultClientPresenter,
    },

    ClientModel,
    ClientPersistenceMapper,
  ],
})
export class ClientModule {}
