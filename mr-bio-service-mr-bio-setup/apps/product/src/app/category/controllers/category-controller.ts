import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Category } from '../domain/core/entities/category';
import { CategoryQueryDoc } from '../domain/dtos/category-query';
import { CreateCategoryBody } from './validations/create-category';
import { UpdateCategoryBody } from './validations/update-category';
import { CountResponse, PaginatedResponse } from '@mr-bio/core/shared';
import { CategoryService } from '../domain/abstractions/category-service';
import { Anonymous, AuthEntityDecorator } from '@mr-bio/core/external-lib';
import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import {
  AuthEntity,
  IHttpResponse,
  FindAllResponse,
  IQuery,
  UnitOfWork,
  buildHttpResponse,
  coreSuccessMessage,
  formatModuleMessage,
  ProjectModule,
} from '@mr-bio/core/shared';

@ApiTags(ProjectModule.CATEGORY)
@Controller('categories')
export class CategoryController {
  constructor(
    private categoryService: CategoryService,
    private unitOfWork: UnitOfWork
  ) {}

  @ApiBearerAuth('JWT')
  @Post()
  async createCategory(
    @Body() body: CreateCategoryBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Category>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.categoryService.create(body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_CREATE_SUCCESS, ProjectModule.CATEGORY)
      );
    });
  }
  @Anonymous()
  @Get('/count')
  async count(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<CountResponse>> {
    const responseData = await this.categoryService.count(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_COUNT_FETCH_SUCCESS, ProjectModule.CATEGORY)
    );
  }

  @CategoryQueryDoc()
  @Anonymous()
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'CATEGORY-MANAGEMENT',
  //     permissions: ['CATEGORY-MANAGEMENT-READ'],
  //   },
  // })
  @Get()
  async get(
    @Query() query: IQuery,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<PaginatedResponse<Category>>> {
    const responseData = await this.categoryService.get(query, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_FETCH_SUCCESS, ProjectModule.CATEGORY)
    );
  }

  // @Authorize({
  //   resourcePermission: {
  //     resource: 'CATEGORY-MANAGEMENT',
  //     permissions: ['CATEGORY-MANAGEMENT-READ'],
  //   },
  // })
  @Anonymous()
  @Get('/:id')
  async getOneById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Category>> {
    const responseData = await this.categoryService.getOneById(id, { authEntity });

    return buildHttpResponse(
      responseData,
      formatModuleMessage(coreSuccessMessage.MODULE_VIEW_SUCCESS, ProjectModule.CATEGORY)
    );
  }

  @ApiBearerAuth('JWT')
  @Patch('/:id')
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'CATEGORY-MANAGEMENT',
  //     permissions: ['CATEGORY-MANAGEMENT-UPDATE'],
  //   },
  // })
  async updateById(
    @Param('id') id: string,
    @Body() body: UpdateCategoryBody,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<Category>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.categoryService.updateById(id, body, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_UPDATE_SUCCESS, ProjectModule.CATEGORY)
      );
    });
  }

  @ApiBearerAuth('JWT')
  // @Authorize({
  //   resourcePermission: {
  //     resource: 'CATEGORY-MANAGEMENT',
  //     permissions: ['CATEGORY-MANAGEMENT-DELETE'],
  //   },
  // })
  @Delete('/:id')
  async deleteById(
    @Param('id') id: string,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const responseData = await this.categoryService.deleteById(id, { session, authEntity });

      return buildHttpResponse(
        responseData,
        formatModuleMessage(coreSuccessMessage.MODULE_DELETE_SUCCESS, ProjectModule.CATEGORY)
      );
    });
  }
}
