import { UserModule } from './user-module';
import { Module, forwardRef } from '@nestjs/common';
import { ActivityLogPublisher } from '@mr-bio/core/shared';
import { MfaModel } from '../../app/authentication/repository/models/mfa-model';
import { MfaServiceImpl } from '../../app/authentication/domain/mfa-service-impl';
import { MfaService } from '../../app/authentication/domain/abstractions/mfa-service';
import { SessionModel } from '../../app/authentication/repository/models/session-model';
import { MfaRepositoryImpl } from '../../app/authentication/repository/mfa-repository-impl';
import { MfaRepository } from '../../app/authentication/repository/abstractions/mfa-repository';
import { SessionRepositoryImpl } from '../../app/authentication/repository/session-repository-impl';
import { AuthenticationServiceImpl } from '../../app/authentication/domain/authentication-service-impl';
import { SessionRepository } from '../../app/authentication/repository/abstractions/session-repository';
import { AuthenticationController } from '../../app/authentication/controllers/authentication-controller';
import { MfaPersistenceMapper } from '../../app/authentication/repository/mappers/mfa-persistence-mapper';
import { AuthenticationService } from '../../app/authentication/domain/abstractions/authentication-service';
import { SessionPersistenceMapper } from '../../app/authentication/repository/mappers/session-persistence-mapper';
import { AuthenticationPresenter } from '../../app/authentication/presenters/abstractions/authentication-presenter';
import { DefaultAuthenticationPresenter } from '../../app/authentication/presenters/default-authentication-presenter';
import { AuthenticationMessagePublisherImpl } from '../../app/authentication/messaging/authentication-message-publisher-impl';
import { AuthenticationMessagePublisher } from '../../app/authentication/messaging/abstractions/authentication-message-publisher';
import { AuthenticationServiceActivityLogDecorator } from '../../app/authentication/decorators/authentication-service-activity-log-decorator';

@Module({
  imports: [forwardRef(() => UserModule)],
  controllers: [AuthenticationController],
  exports: [SessionRepository, MfaService, AuthenticationService],
  providers: [
    MfaPersistenceMapper,
    SessionPersistenceMapper,
    MfaModel,
    SessionModel,
    AuthenticationServiceImpl,
    {
      provide: AuthenticationService,
      inject: [AuthenticationServiceImpl, ActivityLogPublisher],
      useFactory: (
        authenticationServiceImpl: AuthenticationServiceImpl,
        activityLogPublisher: ActivityLogPublisher
      ) => {
        return new AuthenticationServiceActivityLogDecorator(
          authenticationServiceImpl,
          activityLogPublisher
        );
      },
    },
    {
      provide: MfaService,
      useClass: MfaServiceImpl,
    },
    {
      provide: MfaRepository,
      useClass: MfaRepositoryImpl,
    },
    {
      provide: SessionRepository,
      useClass: SessionRepositoryImpl,
    },
    {
      provide: AuthenticationMessagePublisher,
      useClass: AuthenticationMessagePublisherImpl,
    },
    {
      provide: AuthenticationPresenter,
      useClass: DefaultAuthenticationPresenter,
    },
  ],
})
export class AuthenticationModule {}
