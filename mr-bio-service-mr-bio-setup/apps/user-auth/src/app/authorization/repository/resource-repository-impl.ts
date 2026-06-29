import { Injectable } from '@nestjs/common';
import { ResourceModel } from './models/resource-model';
import { ResourceSchema } from './schemas/resource-schema';
import { Resource } from '../domain/core/entities/resource';
import { BaseRepositoryImpl } from '@mr-bio/core/external-lib';
import { ResourceQueryOptions } from '../domain/dtos/resource-query';
import { ResourceRepository } from './abstractions/resource-repository';
import { AssociatedResource } from '../../../shared/types/associated-resource';
import { ServiceOption, Nullable, FindAllResponse } from '@mr-bio/core/shared';
import { ResourcePersistenceMapper } from './mappers/resource-persistence-mapper';
import { ResourceWithSubModules } from '../domain/dtos/resource-with-sub-modules';

@Injectable()
export class ResourceRepositoryImpl
  extends BaseRepositoryImpl<Resource, ResourceSchema, ResourceQueryOptions>
  implements ResourceRepository
{
  constructor(
    protected model: ResourceModel,
    protected mapper: ResourcePersistenceMapper
  ) {
    super(model, mapper);
  }

  async findAllTopLevelParentResources(
    query: ResourceQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ResourceWithSubModules>> {
    return await this.model.findAllTopLevelParentResources(this.mapper.mapQuery(query), option);
  }

  async findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Resource>> {
    const entity = await this.model.findOne({ code }, option);
    if (entity) return this.mapper.persistenceToDomain(entity as ResourceSchema);

    return null;
  }

  async countChildren(parent: string, option?: ServiceOption): Promise<number> {
    return await this.model.model!.countDocuments({ parent }, option);
  }

  async countRolesForResource(id: string, option?: ServiceOption): Promise<number> {
    return await this.model.countRolesById(id, option);
  }

  async findSuperAdminResources(option?: ServiceOption): Promise<AssociatedResource[]> {
    return await this.model.findSuperAdminResources(option);
  }
}
