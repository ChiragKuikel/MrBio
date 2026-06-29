import { Category } from './core/entities/category';
import { CreateCategoryDto } from './dtos/create-category';
import { UpdateCategoryDto } from './dtos/update-category';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CategoryService } from './abstractions/category-service';
import { CategoryRepository } from '../repository/abstractions/category-repository';
import {
  FindAllResponse,
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  CountResponse,
  ProjectModule,
  Nullable,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class CategoryServiceImpl implements CategoryService {
  constructor(private categoryRepository: CategoryRepository) {}
  async findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Category>> {
    const category = await this.categoryRepository.findOneByCode(code, option);
    if (!category)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CATEGORY)
      );

    return category;
  }
  async create(createDto: CreateCategoryDto, option: ServiceOption): Promise<Category> {
    const existingCategory = await this.categoryRepository.findOneByCode(createDto.code, option);
    if (existingCategory)
      throw new BadRequestException(
        formatModuleMessage(coreErrorMessage.MODULE_ALREADY_EXISTS, ProjectModule.CATEGORY)
      );
    const category = new Category();
    category.initialize(createDto);

    return await this.categoryRepository.create(category, option);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.categoryRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<Category>> {
    return await this.categoryRepository.findAll(query, option);
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Category> {
    const category = await this.categoryRepository.findOneById(id, option);
    if (!category)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CATEGORY)
      );

    return category;
  }

  async updateById(
    id: string,
    updateDto: UpdateCategoryDto,
    option: ServiceOption
  ): Promise<Category> {
    const updatedCategory = await this.categoryRepository.updateById(id, updateDto, option);
    if (!updatedCategory)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CATEGORY)
      );

    return updatedCategory;
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.categoryRepository.deleteById(id, option);
  }
}
