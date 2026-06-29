import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { successMessage } from '../../../shared/constants';
import { UserNetwork } from '../domain/core/entities/user';
import { UserResponse } from '../presenters/response/user-response';
import { UserPresenter } from '../presenters/abstractions/user-presenter';
import { Controller, Get, Put, Param, Body, Patch, Delete } from '@nestjs/common';
import { UpdateNetworkInUsersBody } from './validations/update-networks-in-users';
import { UserNetworksService } from '../domain/abstractions/user-networks-service';
import { AuthEntityDecorator, Authorize, ClientAssignerHeaderDoc } from '@mr-bio/core/external-lib';
import {
  AuthEntity,
  IHttpResponse,
  ProjectModule,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
} from '@mr-bio/core/shared';

@ApiTags('User')
@Controller('users')
export class UserNetworksController {
  constructor(
    private userNetworksService: UserNetworksService,
    private unitOfWork: UnitOfWork,
    private userPresenter: UserPresenter
  ) {}

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-UPDATE'],
    },
  })
  @ClientAssignerHeaderDoc()
  @Patch('/networks')
  async updateNetworkInUsers(
    @Body() body: UpdateNetworkInUsersBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<number>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.userNetworksService.updateUserNetworks(body, {
        session,
        authEntity,
      });

      return buildHttpResponse(responseData, successMessage.NETWORK_IN_USERS_UPDATE_SUCCESS);
    });
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-DELETE'],
    },
  })
  @ClientAssignerHeaderDoc()
  @Delete('/networks/:networkId')
  async deleteNetworkInUsers(
    @Param('networkId')
    networkId: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.userNetworksService.deleteUserNetworks(networkId, {
        session,
        authEntity,
      });

      return buildHttpResponse(responseData, successMessage.NETWORK_IN_USERS_UPDATE_SUCCESS);
    });
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-UPDATE'],
    },
  })
  @ClientAssignerHeaderDoc()
  @Put('/:id/networks/:networkId')
  async assignNetworkToUser(
    @Param('id') id: string,
    @Param('networkId') networkId: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userNetworksService.assignNetworkToUser(id, networkId, {
          session,
          authEntity,
        })
      );

      return buildHttpResponse(responseData, successMessage.NETWORK_ASSIGN_SUCCESS);
    });
  }

  @ApiBearerAuth('JWT')
  @Authorize({
    resourcePermission: {
      resource: 'USER-MANAGEMENT',
      permissions: ['USER-MANAGEMENT-UPDATE'],
    },
  })
  @ClientAssignerHeaderDoc()
  @Delete('/:id/networks/:networkId')
  async unassignNetworkFromUser(
    @Param('id') id: string,
    @Param('networkId') networkId: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userNetworksService.unassignNetworkFromUser(id, networkId, {
          session,
          authEntity,
        })
      );

      return buildHttpResponse(responseData, successMessage.NETWORK_UNASSIGN_SUCCESS);
    });
  }

  // @ApiBearerAuth('JWT')
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'USER-MANAGEMENT',
  //     permissions: ['USER-MANAGEMENT-READ'],
  //   },
  // })
  // @Get('/:id/networks')
  // async getUserNetworks(
  //   @Param('id') id: string,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<UserNetwork[]>> {
  //   const responseData = await this.userNetworksService.getUserNetworks(id, { authEntity });

  //   return buildHttpResponse(
  //     responseData,
  //     formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.NETWORK)
  //   );
  // }
}
