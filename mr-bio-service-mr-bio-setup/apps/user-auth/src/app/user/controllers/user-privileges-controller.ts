import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { successMessage } from '../../../shared/constants';
import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserResponse } from '../presenters/response/user-response';
import { UserPresenter } from '../presenters/abstractions/user-presenter';
import { AssignRolesToUserBody } from './validations/assign-roles-to-user';
import { UpdateUserResourcesBody } from './validations/update-user-resources';
import { AssociatedResource } from '../../../shared/types/associated-resource';
import { UserPrivilegesService } from '../domain/abstractions/user-privileges-service';
import { AuthEntityDecorator, Authorize, ClientAssignerHeaderDoc } from '@mr-bio/core/external-lib';
import {
  SelfPrivilegesResponse,
  UserPrivilegesResponse,
} from '../presenters/response/user-privileges-response';
import {
  GrantedResource,
  AuthEntity,
  IHttpResponse,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
} from '@mr-bio/core/shared';

@ApiTags('User')
@Controller('users')
export class UserPrivilegesController {
  constructor(
    private userPrivilegesService: UserPrivilegesService,
    private unitOfWork: UnitOfWork,
    private userPresenter: UserPresenter
  ) {}

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: { resource: 'USER-MANAGEMENT', permissions: ['USER-MANAGEMENT-UPDATE'] },
  })
  @Put('/:id/roles')
  @ClientAssignerHeaderDoc()
  async assignRolesToUser(
    @Param('id') id: string,
    @Body() body: AssignRolesToUserBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userPrivilegesService.assignRolesToUser(id, body, { session, authEntity })
      );

      return buildHttpResponse(responseData, successMessage.ROLE_ASSIGN_SUCCESS);
    });
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-MANAGE-PERMISSION'],
    },
  })
  @Put('/:id/resources')
  @ClientAssignerHeaderDoc()
  async updateUserResources(
    @Param('id') id: string,
    @Body() body: UpdateUserResourcesBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<AssociatedResource[]>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.userPrivilegesService.updateUserResources(
        id,
        this.userPresenter.updateResourcesBodyToDto(body),
        { session, authEntity }
      );

      return buildHttpResponse(responseData, successMessage.RESOURCE_ASSIGN_USER_SUCCESS);
    });
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-MANAGE-PERMISSION'],
    },
  })
  @Get('/:id/privileges')
  async getPrivilegesById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserPrivilegesResponse>> {
    const responseData = this.userPresenter.userPrivilegesToResponse(
      await this.userPrivilegesService.getUserPrivileges(id, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, 'Privilege')
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/self-privileges')
  async getSelfPrivileges(
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<SelfPrivilegesResponse>> {
    const responseData = this.userPresenter.selfPrivilegesToResponse(
      await this.userPrivilegesService.getSelfPrivileges({ authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, 'Self privilege')
    );
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-MANAGE-PERMISSION'],
    },
  })
  @Get('/:id/resources/granted')
  async getGrantedResourcesById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<GrantedResource[]>> {
    const responseData = this.userPresenter.userPrivilegesToGrantedResources(
      await this.userPrivilegesService.getUserGrantedPrivileges(id, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, 'Granted privilege')
    );
  }
}
