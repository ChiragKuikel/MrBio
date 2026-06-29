import { Resource } from '../core/entities/resource';
import { CreateResourceDto } from '../dtos/create-resource';
import { ResourceQueryOptions } from '../dtos/resource-query';
import { ResourceWithSubModules } from '../dtos/resource-with-sub-modules';
import { AssociatedResource } from '../../../../shared/types/associated-resource';
import { BaseService, FindAllResponse, ServiceOption } from '@mr-bio/core/shared';
import { UpdateResourceDto, UpdateResourcePermissionsDto } from '../dtos/update-resource';

export abstract class ResourceService extends BaseService<
  Resource,
  CreateResourceDto,
  UpdateResourceDto,
  ResourceQueryOptions
> {
  abstract getAllTopLevelParentResources(
    query: ResourceQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ResourceWithSubModules>>;

  abstract updatePermissionsById(
    id: string,
    body: UpdateResourcePermissionsDto,
    options?: ServiceOption
  ): Promise<Resource>;

  abstract getSuperAdminResources(option?: ServiceOption): Promise<AssociatedResource[]>;

  abstract validateResourcesIntegrity(
    associatedResources: AssociatedResource[],
    option?: ServiceOption
  ): Promise<void>;
}
