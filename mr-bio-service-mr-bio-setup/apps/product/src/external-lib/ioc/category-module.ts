import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { TokenHelper } from '@mr-bio/core/shared';
import { JwtTokenHelperImpl } from '@mr-bio/core/external-lib';
import { CategoryModel } from '../../app/category/repository/models/category-model';
import { CategoryServiceImpl } from '../../app/category/domain/category-service-impl';
import { CategoryController } from '../../app/category/controllers/category-controller';
import { CategoryService } from '../../app/category/domain/abstractions/category-service';
import { CategoryRepositoryImpl } from '../../app/category/repository/category-repository-impl';
import { CategoryRepository } from '../../app/category/repository/abstractions/category-repository';
import { CategoryPersistenceMapper } from '../../app/category/repository/mappers/category-persistence-mapper';
@Module({
  imports: [JwtModule],

  controllers: [CategoryController],
  exports: [
    CategoryService,
    CategoryModel,
    TokenHelper,
    CategoryRepository,
    CategoryPersistenceMapper,
  ],
  providers: [
    {
      provide: TokenHelper,
      useClass: JwtTokenHelperImpl,
    },
    {
      provide: CategoryService,
      useClass: CategoryServiceImpl,
    },
    {
      provide: CategoryRepository,
      useClass: CategoryRepositoryImpl,
    },
    CategoryModel,
    CategoryPersistenceMapper,
  ],
})
export class CategoryModule {}
