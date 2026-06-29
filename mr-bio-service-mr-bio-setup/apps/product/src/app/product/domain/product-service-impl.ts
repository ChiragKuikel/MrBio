import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dtos/create-product';
import { UpdateProductDto } from './dtos/update-product';
import { Product, ProductTag } from './core/entities/product';
import { ProductService } from './abstractions/product-service';
import { ProductRepository } from '../repository/abstractions/product-repository';
import { CategoryService } from '../../category/domain/abstractions/category-service';
import { CategoryRepository } from '../../category/repository/abstractions/category-repository';
import {
  FindAllResponse,
  NotFoundException,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  IQuery,
  CountResponse,
  ProjectModule,
  PaginatedResponse,
} from '@mr-bio/core/shared';

@Injectable()
export class ProductServiceImpl implements ProductService {
  constructor(
    private productRepository: ProductRepository,
    private categoryService: CategoryService
  ) {}

  // Helper method to transform image URLs to full URLs
  private transformImageUrls(product: Product): Product {
    if (product.images && product.images.length > 0) {
      product.images = product.images.map(imageUrl => {
        // If the image URL is already a full URL, return as is
        if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
          return imageUrl;
        }

        // Extract filename from the path (e.g., "/assets/images/filename.jpg" -> "filename.jpg")
        const filename = imageUrl.split('/').pop();
        if (filename) {
          return `products/image/${filename}`;
        }

        return imageUrl;
      });
    }

    return product;
  }

  // Helper method to transform image URLs for multiple products
  private transformImageUrlsForProducts(products: Product[]): Product[] {
    return products.map(product => this.transformImageUrls(product));
  }

  async getProduct(query: IQuery, option?: ServiceOption): Promise<PaginatedResponse<Product>> {
    const response = await this.productRepository.findAllProduct(query, option);
    if (!response)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    // Transform image URLs for all products
    response.rows = this.transformImageUrlsForProducts(response.rows);

    return response;
  }

  async getByProductTag(
    tag: ProductTag,
    query: IQuery,
    options: ServiceOption
  ): Promise<PaginatedResponse<Product>> {
    const response = await this.productRepository.findAllByProductTag(tag, query, options);
    if (!response)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    // Transform image URLs for all products
    response.rows = this.transformImageUrlsForProducts(response.rows);

    return response;
  }

  async getByCategoryId(
    categoryId: string,
    query: IQuery,
    options: ServiceOption
  ): Promise<PaginatedResponse<Product>> {
    const response = await this.productRepository.findAllByCategoryId(categoryId, query, options);
    if (!response)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    // Transform image URLs for all products
    response.rows = this.transformImageUrlsForProducts(response.rows);

    return response;
  }

  async create(createDto: CreateProductDto, option: ServiceOption): Promise<Product> {
    createDto.categoryId.map(async id => {
      const hasCategory = await this.categoryService.getOneById(id, option);
      if (!hasCategory)
        throw new NotFoundException(
          formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CATEGORY)
        );
    });
    const product = new Product();
    product.initialize(createDto);

    const createdProduct = await this.productRepository.create(product, option);

    // Transform image URLs for the created product
    return this.transformImageUrls(createdProduct);
  }

  async count(query: IQuery, option?: ServiceOption): Promise<CountResponse> {
    return await this.productRepository.count(query, option);
  }

  async get(query: IQuery, option: ServiceOption): Promise<PaginatedResponse<Product>> {
    const response = await this.productRepository.findAll(query, option);

    // Transform image URLs for all products
    response.rows = this.transformImageUrlsForProducts(response.rows);

    return response;
  }

  async getOneById(id: string, option?: ServiceOption): Promise<Product> {
    const product = await this.productRepository.findOneById(id, option);
    if (!product)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    // Transform image URLs for the product
    return this.transformImageUrls(product);
  }

  async updateById(
    id: string,
    updateDto: UpdateProductDto,
    option: ServiceOption
  ): Promise<Product> {
    if (updateDto.categoryId) {
      updateDto.categoryId.map(async id => {
        const hasCategory = await this.categoryService.getOneById(id, option);
        if (!hasCategory)
          throw new NotFoundException(
            formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.CATEGORY)
          );
      });
    }
    const updatedProduct = await this.productRepository.updateById(id, updateDto, option);
    if (!updatedProduct)
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.PRODUCT)
      );

    // Transform image URLs for the updated product
    return this.transformImageUrls(updatedProduct);
  }

  async deleteById(id: string, option: ServiceOption): Promise<void> {
    return await this.productRepository.deleteById(id, option);
  }
}
