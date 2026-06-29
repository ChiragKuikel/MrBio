import { Category } from '../../domain/core/entities/category';
import { BaseRepository, IQuery, Nullable, ServiceOption } from '@mr-bio/core/shared';

export abstract class CategoryRepository extends BaseRepository<Category, IQuery> {
  abstract findOneByCode(code: string, option?: ServiceOption): Promise<Nullable<Category>>;
}
