import { Order } from '../domain/core/entities/order';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrderQueryDoc } from '../domain/dtos/order-query';
import { CreateOrderBody } from './validations/create-order';
import { UpdateOrderBody } from './validations/update-order';
import { OrderService } from '../domain/abstractions/order-service';
import { CountResponse, PaginatedResponse } from '@mr-bio/core/shared';
import { AuthEntityDecorator, Authorize } from '@mr-bio/core/external-lib';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
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

@ApiTags(ProjectModule.ORDER)
@Controller('orders')
export class OrderController {
  constructor(
    private orderService: OrderService,
    private unitOfWork: UnitOfWork
  ) {}

  @ApiBearerAuth('JWT')
  @Post()
  async createOrder(
    @Body() body: CreateOrderBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Order>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.orderService.create(body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.ORDER)
      );
    });
  }

  @ApiBearerAuth('JWT')
  @Get('/count')
  async count(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.orderService.count(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.ORDER)
    );
  }

  @ApiBearerAuth('JWT')
  @Get()
  @OrderQueryDoc()
  async get(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PaginatedResponse<Order>>> {
    const responseData = await this.orderService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.ORDER)
    );
  }

  @ApiBearerAuth('JWT')
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Order>> {
    const responseData = await this.orderService.getOneById(id, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.ORDER)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateOrderBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Order>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.orderService.updateById(id, body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.ORDER)
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
      const responseData = await this.orderService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.ORDER)
      );
    });
  }
}
