import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { ProductModule } from './product-module';
import { TokenHelper } from '@mr-bio/core/shared';
import { JwtTokenHelperImpl } from '@mr-bio/core/external-lib';
import { ProductServiceImpl } from '../../app/product/domain/product-service-impl';
import { ProductService } from '../../app/product/domain/abstractions/product-service';
import { AddToCartModel } from '../../app/add-to-cart/repository/models/addtocart-model';
import { AddToCartServiceImpl } from '../../app/add-to-cart/domain/addtocart-service-impl';
import { AddToCartController } from '../../app/add-to-cart/controllers/addtocart-controller';
import { ProductRepositoryImpl } from '../../app/product/repository/product-repository-impl';
import { AddToCartService } from '../../app/add-to-cart/domain/abstractions/addtocart-service';
import { ProductRepository } from '../../app/product/repository/abstractions/product-repository';
import { AddToCartRepositoryImpl } from '../../app/add-to-cart/repository/addtocart-repository-impl';
import { AddToCartRepository } from '../../app/add-to-cart/repository/abstractions/addtocart-repository';
import { ProductPersistenceMapper } from '../../app/product/repository/mappers/product-persistence-mapper';
import { AddToCartPersistenceMapper } from '../../app/add-to-cart/repository/mappers/addtocart-persistence-mapper';
@Module({
  controllers: [AddToCartController],
  imports: [JwtModule, ProductModule],
  exports: [
    AddToCartService,
    AddToCartModel,
    TokenHelper,
    AddToCartRepository,
    AddToCartPersistenceMapper,
  ],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: ProductRepository,
      useClass: ProductRepositoryImpl,
    },
    {
      provide: AddToCartService,
      useClass: AddToCartServiceImpl,
    },
    {
      provide: AddToCartRepository,
      useClass: AddToCartRepositoryImpl,
    },
    AddToCartModel,
    AddToCartPersistenceMapper,
    ProductPersistenceMapper,
  ],
})
export class AddToCartModule {
  constructor() {
    console.log('AddToCartModule loaded');
  }
}
