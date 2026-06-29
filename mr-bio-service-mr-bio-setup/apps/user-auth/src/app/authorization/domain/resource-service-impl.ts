import { Resource } from './core/entities/resource';
import { errorMessage } from '../../../shared/constants';
import { CreateResourceDto } from './dtos/create-resource';
import { ResourceQueryOptions } from './dtos/resource-query';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ResourceService } from './abstractions/resource-service';
import { ResourceWithSubModules } from './dtos/resource-with-sub-modules';
import { AssociatedResource } from '../../../shared/types/associated-resource';
import { ResourceRepository } from '../repository/abstractions/resource-repository';
import { UpdateResourceDto, UpdateResourcePermissionsDto } from './dtos/update-resource';
import {
  ServiceOption,
  FindAllResponse,
  ConflictException,
  BadRequestException,
  formatModuleMessage,
  coreErrorMessage,
  ProjectModule,
  CountResponse,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class ResourceServiceImpl implements ResourceService {
  constructor(private resourceRepository: ResourceRepository) {}

  async validateResourcesIntegrity(
    associatedResources: AssociatedResource[],
    option?: ServiceOption
  ): Promise<void> {
    const systemResources = await this.get({ limit: 10000 }, option); // TODO: Handle the limit

    associatedResources.forEach(resource => {
      this._validateResourceIntegrity(resource, systemResources.rows);
    });
  }

  async create(createDto: CreateResourceDto, option?: ServiceOption): Promise<Resource> {
    const resource = new Resource();
    resource.initialize(createDto);

    const existingResource = await this.resourceRepository.findOneByCode(resource.code, option);
    if (existingResource) throw new ConflictException(errorMessage.RESOURCE_ALREADY_EXISTS);

    if (createDto.parent) {
      if (!(await this.resourceRepository.findOneByCode(createDto.parent, option))) {
        throw new BadRequestException(
          formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, 'Parent resource')
        );
      }
    }

    return await this.resourceRepository.create(resource, option);
  }

  async count(query: ResourceQueryOptions, option?: ServiceOption): Promise<CountResponse> {
    return await this.resourceRepository.count(query, option);
  }

  async get(
    query: ResourceQueryOptions,
    option?: ServiceOption
  ): Promise<PaginatedResponse<Resource>> {
    return await this.resourceRepository.findAll(query, option);
  }

  async getAllTopLevelParentResources(
    query: ResourceQueryOptions,
    option?: ServiceOption
  ): Promise<FindAllResponse<ResourceWithSubModules>> {
    return await this.resourceRepository.findAllTopLevelParentResources(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Resource> {
    const resource = await this.resourceRepository.findOneById(id, option);
    if (!resource)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.RESOURCE)
      );

    return resource;
  }

  async getSuperAdminResources(option?: ServiceOption): Promise<AssociatedResource[]> {
    return await this.resourceRepository.findSuperAdminResources(option);
  }

  async updateById(
    id: string,
    updateDto: UpdateResourceDto,
    option?: ServiceOption
  ): Promise<Resource> {
    const updatedResource = await this.resourceRepository.updateById(id, updateDto, option);
    if (!updatedResource)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.RESOURCE)
      );

    return updatedResource;
  }

  async updatePermissionsById(
    id: string,
    body: UpdateResourcePermissionsDto,
    options?: ServiceOption
  ): Promise<Resource> {
    const resource = await this.getOneById(id, options);

    const childrenCount = await this.resourceRepository.countChildren(resource.code, options);
    if (childrenCount > 0) {
      throw new BadRequestException(errorMessage.PERMISSION_ASSIGNED_TO_PARENT);
    }

    resource.setPermissions(body.permissions);

    return (await this.resourceRepository.update(resource, options))!;
  }

  async deleteById(id: string, option?: ServiceOption): Promise<void> {
    const resource = await this.getOneById(id, option);

    const assignedRoleCount = await this.resourceRepository.countRolesForResource(id, option);
    if (assignedRoleCount > 0) {
      throw new BadRequestException(errorMessage.RESOURCE_ASSIGNED_TO_ROLE);
    }

    return await this.resourceRepository.deleteById(resource.id, option);
  }

  _validateResourceIntegrity(resource: AssociatedResource, systemResources: Resource[]) {
    const resourceInSystem = systemResources.find(
      systemResource => systemResource.code === resource.code
    );

    if (!resourceInSystem) {
      throw new BadRequestException(
        coreErrorMessage.DEFAULT_ERROR,
        formatModuleMessage(coreErrorMessage.MODULE_DOES_NOT_EXIST, `Resource \`${resource.code}\``)
      );
    }

    const systemResourcePermissionsMap = new Map(
      resourceInSystem.permissions.map(p => [p.code, p])
    );

    resource.permissions.forEach(permission => {
      if (!systemResourcePermissionsMap.has(permission.code)) {
        throw new BadRequestException(
          coreErrorMessage.DEFAULT_ERROR,
          formatModuleMessage(
            coreErrorMessage.MODULE_DOES_NOT_EXIST,
            `Permission \`${permission.code}\` of resource \`${resource.code}\``
          )
        );
      }
    });
  }
}
