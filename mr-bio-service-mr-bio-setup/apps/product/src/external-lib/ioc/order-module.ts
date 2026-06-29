import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ProductModule } from './product-module';
import { TokenHelper } from '@mr-bio/core/shared';
import { CategoryModule } from './category-module';
import { JwtTokenHelperImpl } from '@mr-bio/core/external-lib';
import { OrderModel } from '../../app/order/repository/models/order-model';
import { OrderServiceImpl } from '../../app/order/domain/order-service-impl';
import { OrderController } from '../../app/order/controllers/order-controller';
import { OrderService } from '../../app/order/domain/abstractions/order-service';
import { ProductServiceImpl } from '../../app/product/domain/product-service-impl';
import { CategoryServiceImpl } from '../../app/category/domain/category-service-impl';
import { OrderRepositoryImpl } from '../../app/order/repository/order-repository-impl';
import { ProductService } from '../../app/product/domain/abstractions/product-service';
import { CategoryService } from '../../app/category/domain/abstractions/category-service';
import { OrderRepository } from '../../app/order/repository/abstractions/order-repository';
import { ProductRepositoryImpl } from '../../app/product/repository/product-repository-impl';
import { CategoryRepositoryImpl } from '../../app/category/repository/category-repository-impl';
import { ProductRepository } from '../../app/product/repository/abstractions/product-repository';
import { CategoryRepository } from '../../app/category/repository/abstractions/category-repository';
import { OrderPersistenceMapper } from '../../app/order/repository/mappers/order-persistence-mapper';
import { ProductPersistenceMapper } from '../../app/product/repository/mappers/product-persistence-mapper';
@Module({
  imports: [JwtModule, ProductModule, CategoryModule],
  controllers: [OrderController],
  exports: [OrderService, OrderModel, TokenHelper, OrderPersistenceMapper],
  providers: [
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
    {
      provide: CategoryService,
      useClass: CategoryServiceImpl,
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    {
      provide: OrderService,
      useClass: OrderServiceImpl,
    },
    {
      provide: OrderRepository,
      useClass: OrderRepositoryImpl,
    },
    OrderModel,
    OrderPersistenceMapper,
    ProductPersistenceMapper,
  ],
})
export class OrderModule {}
