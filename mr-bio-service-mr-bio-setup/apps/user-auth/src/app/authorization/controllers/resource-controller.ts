import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ResourceQueryDoc } from './docs/resource-query';
import { Resource } from '../domain/core/entities/resource';
import { AuthEntityDecorator } from '@mr-bio/core/external-lib';
import { ResourceQueryParams } from './validations/resource-query';
import { ResourceService } from '../domain/abstractions/resource-service';
import { ResourceWithSubModules } from '../domain/dtos/resource-with-sub-modules';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  CreateResourceBody,
  UpdateResourceBody,
  UpdateResourcePermissionsBody,
} from './validations';
import {
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  ProjectModule,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
} from '@mr-bio/core/shared';

@ApiTags('Resource')
@Controller('resources')
export class ResourceController {
  constructor(
    private resourceService: ResourceService,
    private unitOfWork: UnitOfWork
  ) {}

  @ApiBearerAuth('JWT')
  @Post()
  async createResource(
    @Body() body: CreateResourceBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Resource>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.resourceService.create(body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.RESOURCE)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get()
  @ResourceQueryDoc()
  async get(
    @Query() query: ResourceQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<ResourceWithSubModules>>> {
    const responseData = await this.resourceService.getAllTopLevelParentResources(query, {
      authEntity,
    });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.RESOURCE)
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Resource>> {
    const responseData = await this.resourceService.getOneById(id, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.RESOURCE)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateResourceBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Resource>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.resourceService.updateById(id, body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.RESOURCE)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id/permissions')
  async updatePermissionsById(
    @Param('id') id: string,
    @Body() body: UpdateResourcePermissionsBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Resource>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.resourceService.updatePermissionsById(id, body, {
        session,
        authEntity,
      });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, 'Resource permissions')
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.resourceService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.RESOURCE)
      );
    });
  }
}
