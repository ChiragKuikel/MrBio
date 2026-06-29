import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokenHelper } from '@mr-bio/core/shared';
import { CategoryModule } from './category-module';
import { JwtTokenHelperImpl } from '@mr-bio/core/external-lib';
import { ProductModel } from '../../app/product/repository/models/product-model';
import { ProductServiceImpl } from '../../app/product/domain/product-service-impl';
import { ProductController } from '../../app/product/controllers/product-controller';
import { CategoryServiceImpl } from '../../app/category/domain/category-service-impl';
import { ProductService } from '../../app/product/domain/abstractions/product-service';
import { CategoryService } from '../../app/category/domain/abstractions/category-service';
import { ProductRepositoryImpl } from '../../app/product/repository/product-repository-impl';
import { CategoryRepositoryImpl } from '../../app/category/repository/category-repository-impl';
import { ProductRepository } from '../../app/product/repository/abstractions/product-repository';
import { CategoryRepository } from '../../app/category/repository/abstractions/category-repository';
import { ProductPersistenceMapper } from '../../app/product/repository/mappers/product-persistence-mapper';

@Module({
  imports: [JwtModule, CategoryModule],
  controllers: [ProductController],
  exports: [ProductService, ProductModel, TokenHelper],
  providers: [
    {
      provide: CategoryService,
      useClass: CategoryServiceImpl,
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: ProductService,
      useClass: ProductServiceImpl,
    },
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
    ProductModel,
    ProductPersistenceMapper,
  ],
})
export class ProductModule {}
