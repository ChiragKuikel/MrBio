import { RoleQueryDoc } from './docs/role-query';
import { Role } from '../domain/core/entities/role';
import { RoleInfo } from '../domain/dtos/role-info';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RoleService } from '../domain/abstractions/role-service';
import { RolePresenter } from '../presenters/abstractions/role-presenter';
import { RoleWithModulesResponse } from '../presenters/response/role-with-modules-response';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query } from '@nestjs/common';
import {
  CreateRoleBody,
  RoleQueryParams,
  UpdateRoleBody,
  UpdateRoleResourcesBody,
} from './validations';
import {
  Anonymous,
  AuthEntityDecorator,
  Authorize,
  ClientAssignerHeaderDoc,
} from '@mr-bio/core/external-lib';
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

@ApiTags('Role')
@Controller('roles')
export class RoleController {
  constructor(
    private roleService: RoleService,
    private rolePresenter: RolePresenter,
    private unitOfWork: UnitOfWork
  ) {}
  @Anonymous()
  // @ApiBearerAuth('JWT')
  @Post()
  @ClientAssignerHeaderDoc()
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'ROLES-PERMISSION-MANAGEMENT',
  //     permissions: ['ROLES-PERMISSION-MANAGEMENT-CREATE'],
  //   },
  // })
  async createRole(
    @Body() body: CreateRoleBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Role>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.roleService.create(body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.ROLE)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get()
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'ROLES-PERMISSION-MANAGEMENT',
  //     permissions: ['ROLES-PERMISSION-MANAGEMENT-READ'],
  //   },
  //   parentResourcePermissions: [
  //     {
  //       resource: 'USER-MANAGEMENT',
  //       permissions: ['USER-MANAGEMENT-READ-ACTIVE', 'USER-MANAGEMENT-READ'],
  //     },
  //   ],
  // })
  @RoleQueryDoc()
  async get(
    @Query() query: RoleQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<RoleInfo>>> {
    const responseData = await this.roleService.getRoleInfos(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.ROLE)
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/:id')
  @Authorize({
    resourcePermission: {
      resource: 'ROLES-PERMISSION-MANAGEMENT',
      permissions: ['ROLES-PERMISSION-MANAGEMENT-READ'],
    },
  })
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<RoleInfo>> {
    const responseData = await this.roleService.getRoleInfoById(id, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.ROLE)
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/:id/resources')
  @Authorize({
    resourcePermission: {
      resource: 'ROLES-PERMISSION-MANAGEMENT',
      permissions: ['ROLES-PERMISSION-MANAGEMENT-MANAGE-PERMISSION'],
    },
  })
  async getResourcesById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<RoleWithModulesResponse>> {
    const responseData = this.rolePresenter.roleToRoleWithModulesResponse(
      await this.roleService.getOneById(id, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.RESOURCE)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  @ClientAssignerHeaderDoc()
  @Authorize({
    resourcePermission: {
      resource: 'ROLES-PERMISSION-MANAGEMENT',
      permissions: ['ROLES-PERMISSION-MANAGEMENT-UPDATE'],
    },
  })
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateRoleBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Role>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.roleService.updateById(id, body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.ROLE)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Put('/:id/resources')
  @Authorize({
    resourcePermission: {
      resource: 'ROLES-PERMISSION-MANAGEMENT',
      permissions: ['ROLES-PERMISSION-MANAGEMENT-MANAGE-PERMISSION'],
    },
  })
  @ClientAssignerHeaderDoc()
  async updateResourcesById(
    @Param('id') id: string,
    @Body() body: UpdateRoleResourcesBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<RoleWithModulesResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.rolePresenter.roleToRoleWithModulesResponse(
        await this.roleService.updateResourcesById(
          id,
          this.rolePresenter.updateResourcesBodyToDto(body),
          { session, authEntity }
        )
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, 'Role resource')
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Delete('/:id')
  @ClientAssignerHeaderDoc()
  @Authorize({
    resourcePermission: {
      resource: 'ROLES-PERMISSION-MANAGEMENT',
      permissions: ['ROLES-PERMISSION-MANAGEMENT-DELETE'],
    },
  })
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.roleService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.ROLE)
      );
    });
  }
}
