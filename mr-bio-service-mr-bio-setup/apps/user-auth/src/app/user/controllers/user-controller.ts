import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserBody } from './validations/create-user';
import { successMessage } from '../../../shared/constants';
import { UpdateUserBody } from './validations/update-user';
import { UserQueryParams } from './validations/user-query';
import { ResetPasswordBody } from './validations/reset-password';
import { UserService } from '../domain/abstractions/user-service';
import { ChangePasswordBody } from './validations/change-password';
import { ForgotPasswordBody } from './validations/forgot-password';
import { UserResponse } from '../presenters/response/user-response';
import { ActivateAccountBody } from './validations/activate-account';
import { UpdateMFAStatusBody } from './validations/update-mfa-status';
import { UpdateUserStatusBody } from './validations/update-user-status';
import { UserPresenter } from '../presenters/abstractions/user-presenter';
import { SendAccountActivationBody } from './validations/send-account-activation';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  Anonymous,
  AuthenticationGuard,
  AuthEntityDecorator,
  Authorize,
  ClientAssignerHeaderDoc,
} from '@mr-bio/core/external-lib';
import {
  UserQueryDoc,
  CreateUserDoc,
  UpdateUserDoc,
  DeleteUserDoc,
  ChangePasswordDoc,
  ResetPasswordDoc,
  GetUserDoc,
  GetUsersDoc,
  ForgotPasswordDoc,
  UserCountQueryDoc,
} from './docs';
import {
  CountResponse,
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  ProjectModule,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  AuthUser,
} from '@mr-bio/core/shared';

@ApiTags(ProjectModule.USER)
@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private unitOfWork: UnitOfWork,
    private userPresenter: UserPresenter
  ) {}
  @Anonymous()
  @CreateUserDoc()
  @Post()
  async createUser(@Body() body: CreateUserBody): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userService.create(body, { session })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.USER)
      );
    });
  }
  @Anonymous()
  // @ApiBearerAuth('JWT')
  // @UseGuards(AuthenticationGuard) // Add this
  // @Authorize({
  //   parentResourcePermissions: [{ resource: 'DASHBOARD', permissions: ['DASHBOARD-ADMIN-VIEW'] }],
  // })
  @Get('/count')
  @UserCountQueryDoc()
  async count(
    @Query() query: UserQueryParams
    // @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.unitOfWork.execute(async session => {
      return await this.userService.count(query, { session });
    });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.USER)
    );
  }
  // @Anonymous()
  @ApiBearerAuth('JWT')
  // @Authorize({
  // resourcePermission: {
  //   resource: '',
  //   permissions: [''],
  //   // resource: 'ADMIN-DASHBOARD',
  //   // permissions: ['ADMIN-DASHBOARD'],
  // },
  // })
  // @Anonymous()
  @Get()
  @UserQueryDoc()
  @GetUsersDoc()
  async get(
    @Query() query: UserQueryParams,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<UserResponse>>> {
    const responseData = this.userPresenter.findAllDomainToPresentation(
      (await this.userService.get(query, { authEntity })).rows
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.USER)
    );
  }

  @ApiBearerAuth('JWT')
  @Anonymous() // Used by gateway to fetch user resources, protected by gateway from the outside
  @Get('/:id/validate')
  async validateUser(
    @Param('id') id: string
    // @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<AuthUser>> {
    const responseData = this.userPresenter.userWithGrantedPrivilegesToAuthUser(
      await this.userService.validateUser(id, {})
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.USER)
    );
  }

  // @ApiBearerAuth('JWT')
  // @Authorize({
  //   resourcePermission: { resource: 'USER-MANAGEMENT', permissions: ['USER-MANAGEMENT-UPDATE'] },
  // })
  // @Patch('/:id/status')
  // @ClientAssignerHeaderDoc()
  // async updateUserStatus(
  //   @Param('id') id: string,
  //   @Body() body: UpdateUserStatusBody,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<UserResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const responseData = this.userPresenter.domainToPresentation(
  //       await this.userService.updateUserStatus(id, body, { session, authEntity })
  //     );

  //     return buildHttpResponse(
  //       responseData,
  //       formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.USER)
  //     );
  //   });
  // }

  // @ApiBearerAuth('JWT')
  // @Patch('/:id/mfa')
  // @ClientAssignerHeaderDoc()
  // async updateMFAStatus(
  //   @Param('id') id: string,
  //   @Body() body: UpdateMFAStatusBody,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<UserResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const responseData = this.userPresenter.domainToPresentation(
  //       await this.userService.updateMFAStatus(id, body, { session, authEntity })
  //     );

  //     return buildHttpResponse(
  //       responseData,
  //       formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.USER)
  //     );
  //   });
  // }

  // @Authorize({
  //   resourcePermission: {
  //     resource: 'USER-MANAGEMENT',
  //     permissions: ['USER-MANAGEMENT-READ'],
  //   },
  // })
  @ApiBearerAuth('JWT')
  @GetUserDoc()
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    const responseData = this.userPresenter.domainToPresentation(
      await this.userService.getOneById(id, { authEntity })
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.USER)
    );
  }

  @ApiBearerAuth('JWT')
  @ChangePasswordDoc()
  @ClientAssignerHeaderDoc()
  @Patch('/change-password')
  async changePassword(
    @Body() body: ChangePasswordBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return this.unitOfWork.execute(async session => {
      const responseData = await this.userService.changePassword(body, { session, authEntity });

      return buildHttpResponse(responseData, successMessage.PASSWORD_CHANGE_SUCCESS);
    });
  }

  @Anonymous()
  @ForgotPasswordDoc()
  @Post('/forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordBody): Promise<IHttpResponse<void>> {
    return this.unitOfWork.execute(async session => {
      const responseData = await this.userService.forgotPassword(body, { session });

      return buildHttpResponse(responseData, successMessage.PASSWORD_RESET_LINK_SUCCESS);
    });
  }

  @Anonymous()
  @ResetPasswordDoc()
  @Patch('/reset-password')
  async resetPassword(
    @Body() body: ResetPasswordBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return this.unitOfWork.execute(async session => {
      const responseData = await this.userService.resetPassword(body, { session, authEntity });

      return buildHttpResponse(responseData, successMessage.PASSWORD_RESET_SUCCESS);
    });
  }

  // @ApiBearerAuth('JWT')
  // @UpdateUserDoc()
  // @Patch('/profile')
  // @ClientAssignerHeaderDoc()
  // async updateProfile(
  //   @Body() body: UpdateUserBody,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<UserResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const responseData = this.userPresenter.domainToPresentation(
  //       await this.userService.updateById(authEntity.id, body, { session, authEntity })
  //     );

  //     return buildHttpResponse(
  //       responseData,
  //       formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.USER)
  //     );
  //   });
  // }

  @ApiBearerAuth('JWT')
  @UpdateUserDoc()
  @Patch('/:id')
  // @Authorize({
  //   resourcePermission: { resource: 'USER-MANAGEMENT', permissions: ['USER-MANAGEMENT-UPDATE'] },
  // })
  // @ClientAssignerHeaderDoc()
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateUserBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<UserResponse>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = this.userPresenter.domainToPresentation(
        await this.userService.updateById(id, body, { session, authEntity })
      );

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.USER)
      );
    });
  }

  // @Authorize({
  //   resourcePermission: { resource: 'USER-MANAGEMENT', permissions: ['USER-MANAGEMENT-INVITE'] },
  // })
  // @Post('/send-invite')
  // @ApiBearerAuth('JWT')
  // async sendAccountActivation(
  //   @Body() body: SendAccountActivationBody,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<void>> {
  //   const data = await this.unitOfWork.execute(async session => {
  //     return await this.userService.sendAccountActivation(body, { session, authEntity });
  //   });

  //   return buildHttpResponse(data, successMessage.INVITATION_SEND_SUCCESS);
  // }

  // @Post('/activate-account')
  // @ApiBearerAuth('JWT')
  // @Anonymous()
  // async activateAccount(
  //   @Body() body: ActivateAccountBody,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<void>> {
  //   const data = await this.unitOfWork.execute(async session => {
  //     return await this.userService.activateAccount(body, { session, authEntity });
  //   });

  //   return buildHttpResponse(data, successMessage.ACCOUNT_ACTIVATION_SUCCESS);
  // }

  @ApiBearerAuth('JWT')
  @DeleteUserDoc()
  @Authorize({
    resourcePermission: { resource: 'USER-MANAGEMENT', permissions: ['USER-MANAGEMENT-DELETE'] },
  })
  @ClientAssignerHeaderDoc()
  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.userService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.USER)
      );
    });
  }
}
