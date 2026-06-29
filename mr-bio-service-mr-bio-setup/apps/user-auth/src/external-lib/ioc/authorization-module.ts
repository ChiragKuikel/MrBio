import { Module } from '@nestjs/common';
import { EntityActivityLogPublisherFactory } from '@mr-bio/core/shared';
import { RoleModel } from '../../app/authorization/repository/models/role-model';
import { RoleServiceImpl } from '../../app/authorization/domain/role-service-impl';
import { RoleController } from '../../app/authorization/controllers/role-controller';
// import { RoleController } from '../../app/authorization/controllers/role-controller';
import { RoleService } from '../../app/authorization/domain/abstractions/role-service';
import { ResourceModel } from '../../app/authorization/repository/models/resource-model';
import { ResourceServiceImpl } from '../../app/authorization/domain/resource-service-impl';
import { ResourceController } from '../../app/authorization/controllers/resource-controller';
import { RoleRepositoryImpl } from '../../app/authorization/repository/role-repository-impl';
import { ResourceService } from '../../app/authorization/domain/abstractions/resource-service';
import { RolePresenter } from '../../app/authorization/presenters/abstractions/role-presenter';
import { RoleRepository } from '../../app/authorization/repository/abstractions/role-repository';
import { DefaultRolePresenter } from '../../app/authorization/presenters/default-role-presenter';
import { ResourceRepositoryImpl } from '../../app/authorization/repository/resource-repository-impl';
import { ResourceRepository } from '../../app/authorization/repository/abstractions/resource-repository';
import { RolePersistenceMapper } from '../../app/authorization/repository/mappers/role-persistence-mapper';
import { ResourcePersistenceMapper } from '../../app/authorization/repository/mappers/resource-persistence-mapper';
import { RoleServiceActivityLogDecorator } from '../../app/authorization/decorators/role-service-activity-log-decorator';

@Module({
  exports: [ResourceService, RoleService],
  controllers: [ResourceController, RoleController],
  providers: [
    RolePersistenceMapper,
    RoleModel,
    RoleServiceImpl,
    {
      provide: RoleService,
      inject: [RoleServiceImpl, EntityActivityLogPublisherFactory],
      useFactory: (
        roleServiceImpl: RoleServiceImpl,
        entityActivityLogPublisherFactory: EntityActivityLogPublisherFactory
      ) => {
        return new RoleServiceActivityLogDecorator(
          roleServiceImpl as unknown as RoleService,
          entityActivityLogPublisherFactory
        );
      },
    },
    {
      provide: RoleRepository,
      useClass: RoleRepositoryImpl,
    },
    {
      provide: RolePresenter,
      useClass: DefaultRolePresenter,
    },

    ResourcePersistenceMapper,
    ResourceModel,
    {
      provide: ResourceService,
      useClass: ResourceServiceImpl,
    },
    {
      provide: ResourceRepository,
      useClass: ResourceRepositoryImpl,
    },
  ],
})
export class AuthorizationModule {}
