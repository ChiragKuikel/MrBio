import { Resource } from '../../domain/core/entities/resource';
import { ResourceQueryOptions } from '../../domain/dtos/resource-query';
import { AssociatedResource } from '../../../../shared/types/associated-resource';
import { ResourceWithSubModules } from '../../domain/dtos/resource-with-sub-modules';
import { BaseRepository, Nullable, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';

export abstract class ResourceRepository extends BaseRepository<Resource, ResourceQueryOptions> {
  abstract findAllTopLevelParentResources(
    query: ResourceQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ResourceWithSubModules>>;
  abstract findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Resource>>;
  abstract countChildren(parent: string, option?: ServiceOption): Promise<number>;
  abstract countRolesForResource(id: string, option?: ServiceOption): Promise<number>;
  abstract findSuperAdminResources(option?: ServiceOption): Promise<AssociatedResource[]>;
}
