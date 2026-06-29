import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AddToCart } from '../domain/core/entities/addtocart';
import { CreateAddToCartBody } from './validations/create-addtocart';
import { UpdateAddToCartBody } from './validations/update-addtocart';
import { AddToCartService } from '../domain/abstractions/addtocart-service';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { CountResponse, FindAllResponse, Nullable, PaginatedResponse } from '@mr-bio/core/shared';
import {
  Anonymous,
  AuthEntityDecorator,
  Authorize,
  ClientAssignerHeaderDoc,
} from '@mr-bio/core/external-lib';
import {
  AuthEntity,
  IHttpResponse,
  IQuery,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  ProjectModule,
} from '@mr-bio/core/shared';

@ApiTags(ProjectModule.ADD_TO_CART)
@Controller('add-to-carts')
export class AddToCartController {
  constructor(
    private addToCartService: AddToCartService,
    private unitOfWork: UnitOfWork
  ) {
    console.log('AddToCartController instantiated');
  }

  @ApiBearerAuth('JWT')
  @Post()
  async createAddToCart(
    @Body() body: CreateAddToCartBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<AddToCart>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.addToCartService.addToCart(body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.ADD_TO_CART)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get('/count')
  async count(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.addToCartService.count(
      { ...query, userId: authEntity.userId },
      { authEntity }
    );

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.ADD_TO_CART)
    );
  }

  // @ApiBearerAuth('JWT')
  // @Get()
  // async get(
  //   @Query() query: IQuery,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<PaginatedResponse<AddToCart>>> {
  //   const responseData = await this.addToCartService.get(query, { authEntity });

  //   return buildHttpResponse(
  //     responseData,
  //     formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.ADD_TO_CART)
  //   );
  // }

  // @ApiBearerAuth('JWT')
  // @Get('/:id')
  // async getOneById(
  //   @Param('id') id: string,
  //   @AuthEntityDecorator() authEntity: AuthEntity
  // ): Promise<IHttpResponse<AddToCart>> {
  //   const responseData = await this.addToCartService.getOneById(id, { authEntity });

  //   return buildHttpResponse(
  //     responseData,
  //     formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.ADD_TO_CART)
  //   );
  // }

  @ApiBearerAuth('JWT')
  @Get('/:userId')
  async getByUserId(
    @Param('userId') userId: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<FindAllResponse<AddToCart>>> {
    const responseData = await this.addToCartService.getByUserId(userId, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.ADD_TO_CART)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateAddToCartBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<AddToCart>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.addToCartService.updateById(id, body, {
        session,
        authEntity,
      });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.ADD_TO_CART)
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
      const responseData = await this.addToCartService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.ADD_TO_CART)
      );
    });
  }
}
