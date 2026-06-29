import { Module, forwardRef } from '@nestjs/common';
import { AuthenticationModule } from './auth-module';
import { AuthorizationModule } from './authorization-module';
import { UserModel } from '../../app/user/repository/models/user-model';
import { EntityActivityLogPublisherFactory } from '@mr-bio/core/shared';
import { UserServiceImpl } from '../../app/user/domain/user-service-impl';
import { UserController } from '../../app/user/controllers/user-controller';
import { UserService } from '../../app/user/domain/abstractions/user-service';
import { UserRepositoryImpl } from '../../app/user/repository/user-repository-impl';
import { UserPresenter } from '../../app/user/presenters/abstractions/user-presenter';
import { UserRepository } from '../../app/user/repository/abstractions/user-repository';
import { DefaultUserPresenter } from '../../app/user/presenters/default-user-presenter';
import { UserNetworksServiceImpl } from '../../app/user/domain/user-networks-service-impl';
import { UserNetworksController } from '../../app/user/controllers/user-networks-controller';
import { UserPrivilegesServiceImpl } from '../../app/user/domain/user-privileges-service-impl';
import { UserNetworksService } from '../../app/user/domain/abstractions/user-networks-service';
import { UserMessagePublisherImpl } from '../../app/user/messaging/user-message-publisher-impl';
import { UserPrivilegesController } from '../../app/user/controllers/user-privileges-controller';
import { UserPersistenceMapper } from '../../app/user/repository/mappers/user-persistence-mapper';
import { UserPrivilegesService } from '../../app/user/domain/abstractions/user-privileges-service';
import { UserMessagePublisher } from '../../app/user/messaging/abstractions/user-message-publisher';
import { UserServiceActivityLogDecorator } from '../../app/user/decorators/user-service-activity-log-decorator';

@Module({
  exports: [UserService],
  controllers: [UserPrivilegesController, UserNetworksController, UserController],
  imports: [forwardRef(() => AuthenticationModule), AuthorizationModule],
  providers: [
    UserServiceImpl,
    {
      provide: UserService,
      inject: [UserServiceImpl, EntityActivityLogPublisherFactory],
      useFactory: (
        userServiceImpl: UserServiceImpl,
        entityActivityLogPublisherFactory: EntityActivityLogPublisherFactory
      ) => {
        return new UserServiceActivityLogDecorator(
          userServiceImpl,
          entityActivityLogPublisherFactory
        );
      },
    },
    {
      provide: UserMessagePublisher,
      useClass: UserMessagePublisherImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
    {
      provide: UserPresenter,
      useClass: DefaultUserPresenter,
    },
    {
      provide: UserPrivilegesService,
      useClass: UserPrivilegesServiceImpl,
    },
    {
      provide: UserNetworksService,
      useClass: UserNetworksServiceImpl,
    },

    UserModel,
    UserPersistenceMapper,
  ],
})
export class UserModule {}
