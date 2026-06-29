// import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
// import { CreateClientBody } from './validations/create-client';
// import { UpdateClientBody } from './validations/update-client';
// import { ClientService } from '../domain/abstractions/client-service';
// import { ClientResponse } from '../presenters/response/client-response';
// import { CreateClientSecretBody } from './validations/create-client-secret';
// import { RevokeClientSecretBody } from './validations/revoke-client-secret';
// import { ClientPresenter } from '../presenters/abstractions/client-presenter';
// import { CreateClientAccessTokenBody } from './validations/create-client-access-token';
// import { CountResponse, AuthClient, ClientRefreshTokenPayload } from '@mr-bio/core/shared';
// import { RefreshTokenGuard } from '../../../external-lib/nest-js/guards/refresh-token-guard';
// import { CreateClientSecretResponse } from '../presenters/response/create-client-secret-response';
// import { CreateClientAccessTokenResponse } from '../presenters/response/create-client-access-token-response';
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Patch,
//   Post,
//   Query,
//   UseGuards,
// } from '@nestjs/common';
// import {
//   AuthEntity,
//   IHttpResponse,
//   FindAllResponse,
//   IQuery,
//   UnitOfWork,
//   buildHttpResponse,
//   coreSuccessMessage,
//   formatModuleMessage,
//   ProjectModule,
// } from '@mr-bio/core/shared';
// import {
//   Anonymous,
//   AuthEntityDecorator,
//   Authorize,
//   ClientAssignerHeaderDoc,
//   RefreshTokenHeaderDoc,
//   RefreshTokenPayloadDecorator,
//   SuperAdminHeaderDoc,
// } from '@mr-bio/core/external-lib';

// @ApiTags(ProjectModule.CLIENT)
// @Controller('clients')
// export class ClientController {
//   constructor(
//     private clientService: ClientService,
//     private unitOfWork: UnitOfWork,
//     private clientPresenter: ClientPresenter
//   ) {}

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-CREATE'],
//     },
//   })
//   @SuperAdminHeaderDoc()
//   @ClientAssignerHeaderDoc()
//   @Post()
//   async createClient(
//     @Body() body: CreateClientBody,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<ClientResponse>> {
//     return await this.unitOfWork.execute(async session => {
//       const responseData = this.clientPresenter.domainToPresentation(
//         await this.clientService.create(body, { session, authEntity })
//       );

//       return buildHttpResponse(
//         responseData,
//         formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.CLIENT)
//       );
//     });
//   }

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: { resource: 'CLIENT-MANAGEMENT', permissions: ['CLIENT-MANAGEMENT-READ'] },
//   })
//   @Get('/count')
//   async count(
//     @Query() query: IQuery,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<CountResponse>> {
//     const responseData = await this.clientService.count(query, { authEntity });

//     return buildHttpResponse(
//       responseData,
//       formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.CLIENT)
//     );
//   }

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: { resource: 'CLIENT-MANAGEMENT', permissions: ['CLIENT-MANAGEMENT-READ'] },
//   })
//   @Get()
//   async get(
//     @Query() query: IQuery,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<FindAllResponse<ClientResponse>>> {
//     const responseData = this.clientPresenter.findAllDomainToPresentation(
//       await this.clientService.get(query, { authEntity })
//     );

//     return buildHttpResponse(
//       responseData,
//       formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.CLIENT)
//     );
//   }

//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-READ'],
//     },
//   })
//   @ApiBearerAuth('JWT')
//   @Get('/:id')
//   async getOneById(
//     @Param('id') id: string,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<ClientResponse>> {
//     const responseData = this.clientPresenter.domainToPresentation(
//       await this.clientService.getOneById(id, { authEntity })
//     );

//     return buildHttpResponse(
//       responseData,
//       formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.CLIENT)
//     );
//   }

//   @ApiBearerAuth('JWT')
//   @Patch('/:id')
//   @ClientAssignerHeaderDoc()
//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-UPDATE'],
//     },
//   })
//   async updateById(
//     @Param('id') id: string,
//     @Body() body: UpdateClientBody,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<ClientResponse>> {
//     return await this.unitOfWork.execute(async session => {
//       const responseData = this.clientPresenter.domainToPresentation(
//         await this.clientService.updateById(id, body, { session, authEntity })
//       );

//       return buildHttpResponse(
//         responseData,
//         formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.CLIENT)
//       );
//     });
//   }

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-DELETE'],
//     },
//   })
//   @ClientAssignerHeaderDoc()
//   @Delete('/:id')
//   async deleteById(
//     @Param('id') id: string,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<void>> {
//     return await this.unitOfWork.execute(async session => {
//       const responseData = await this.clientService.deleteById(id, { session, authEntity });

//       return buildHttpResponse(
//         responseData,
//         formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.CLIENT)
//       );
//     });
//   }

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-CREATE-CLIENT-SECRET'],
//     },
//   })
//   @ClientAssignerHeaderDoc()
//   @Post('/:id/client-secrets')
//   async createClientSecret(
//     @Param('id') id: string,
//     @Body() body: CreateClientSecretBody,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<CreateClientSecretResponse>> {
//     return await this.unitOfWork.execute(async session => {
//       const responseData = this.clientPresenter.createdClientSecretToResponse(
//         await this.clientService.createClientSecret(id, body, { session, authEntity })
//       );

//       return buildHttpResponse(
//         responseData,
//         formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, 'Client secret')
//       );
//     });
//   }

//   @ApiBearerAuth('JWT')
//   @Authorize({
//     resourcePermission: {
//       resource: 'CLIENT-MANAGEMENT',
//       permissions: ['CLIENT-MANAGEMENT-REVOKE-CLIENT-SECRET'],
//     },
//   })
//   @ClientAssignerHeaderDoc()
//   @Delete('/:id/client-secrets')
//   async revokeClientSecret(
//     @Param('id') id: string,
//     @Body() body: RevokeClientSecretBody,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<void>> {
//     return await this.unitOfWork.execute(async session => {
//       await this.clientService.revokeClientSecret(id, body, {
//         session,
//         authEntity,
//       });

//       return buildHttpResponse(
//         null,
//         formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, 'Client secret')
//       );
//     });
//   }

//   @Post('/:id/access-token')
//   @Anonymous()
//   @ClientAssignerHeaderDoc()
//   async createClientAccessToken(
//     @Param('id') id: string,
//     @Body() body: CreateClientAccessTokenBody
//   ): Promise<IHttpResponse<CreateClientAccessTokenResponse>> {
//     return await this.unitOfWork.execute(async session => {
//       const responseData = this.clientPresenter.clientAuthTokensToResponse(
//         await this.clientService.createClientAccessToken(id, body, { session })
//       );

//       return buildHttpResponse(
//         responseData,
//         formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, 'Client access token')
//       );
//     });
//   }

//   @Post('/refresh-token')
//   @Anonymous()
//   @RefreshTokenHeaderDoc()
//   @UseGuards(RefreshTokenGuard)
//   async refreshAccessToken(
//     @RefreshTokenPayloadDecorator() refreshTokenPayload: ClientRefreshTokenPayload
//   ): Promise<IHttpResponse<CreateClientAccessTokenResponse>> {
//     return await this.unitOfWork.execute(async session => {
//       const data = this.clientPresenter.clientAuthTokensToResponse(
//         await this.clientService.refreshClientAccessToken(refreshTokenPayload, { session })
//       );

//       return buildHttpResponse(
//         data,
//         formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, 'Client access token')
//       );
//     });
//   }

//   @ApiBearerAuth('JWT')
//   @Anonymous() // Used by gateway to fetch client token resources, protected by gateway from the outside
//   @Get('/:id/token/:tokenId/validate')
//   async validateClientToken(
//     @Param('id') id: string,
//     @Param('tokenId') tokenId: string,
//     @AuthEntityDecorator() authEntity: AuthEntity
//   ): Promise<IHttpResponse<AuthClient>> {
//     const responseData = this.clientPresenter.clientWithGrantedPrivilegesToAuthClient(
//       await this.clientService.validateClientToken(id, tokenId, { authEntity })
//     );

//     return buildHttpResponse(
//       responseData,
//       formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.CLIENT)
//     );
//   }

//   @ApiBearerAuth('JWT')
//   @Patch('/:id/token/:tokenId/usage')
//   @Anonymous() // Used by other services to update token usage, protected by gateway from the outside
//   async updateTokenUsage(
//     @Param('id') id: string,
//     @Param('tokenId') tokenId: string
//   ): Promise<IHttpResponse<void>> {
//     return await this.unitOfWork.execute(async session => {
//       await this.clientService.updateTokenUsage(id, tokenId, { session });

//       return buildHttpResponse(
//         null,
//         formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, 'Token usage')
//       );
//     });
//   }
// }
