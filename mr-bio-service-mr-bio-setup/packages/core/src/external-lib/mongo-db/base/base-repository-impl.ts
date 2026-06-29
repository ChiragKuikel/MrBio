import { Logger } from '@nestjs/common';
import { BaseSchema, IModel } from '../interface';
import { Nullable } from '../../../shared/domain/types/object';
import {
  BaseEntity,
  BasePersistenceMapper,
  BaseRepository,
  DomainException,
  FindAllResponse,
  IQuery,
  ServiceOption,
  coreErrorMessage,
  formatModuleMessage,
  DBQuery,
  CountResponse,
  PaginatedResponse,
  PaginatedQueryParams,
} from '../../../shared';

export class BaseRepositoryImpl<
  Entity extends BaseEntity,
  Schema extends BaseSchema,
  QueryOptions = IQuery,
> implements BaseRepository<Entity, QueryOptions>
{
  constructor(
    protected model: IModel<Schema>,
    protected mapper: BasePersistenceMapper<Entity, Schema, QueryOptions>
  ) {}

  async create(entity: Entity, option?: ServiceOption): Promise<Entity> {
    {
      const createdEntity = await this.model.create(this.mapper.domainToPersistence(entity), {
        ...option,
        returnModel: true,
      });
      if (!createdEntity)
        throw new DomainException(
          coreErrorMessage.DEFAULT_ERROR,
          formatModuleMessage(
            coreErrorMessage.MODULE_CREATION_FAILED,
            `document for collection: ${this.model.modelName}`
          )
        );

      return this.mapper.persistenceToDomain(createdEntity as Schema);
    }
  }

  async count(query: QueryOptions, option?: ServiceOption): Promise<CountResponse> {
    const countResponse = await this.model.count(this.mapper.mapQuery(query), option);

    return countResponse;
  }

  async findAll(query: QueryOptions, option?: ServiceOption): Promise<PaginatedResponse<Entity>> {
    const condition = this.mapper.mapQuery(query);
    const rows = await this.model.find(condition, option);

    const countResponse = await this.model.count(this.mapper.mapQuery(query), option);
    const limit = (query as PaginatedQueryParams)?.limit ?? 10;
    const offset = (query as PaginatedQueryParams)?.page ?? 0;

    return {
      rows: rows.map(r => this.mapper.persistenceToDomain(r)),
      metaInfo: {
        totalPage: Math.ceil(countResponse.count / limit),
        hasNextPage: offset + limit < countResponse.count,
        hasPreviousPage: offset > 0,
        currentPage: offset,
        totalCount: countResponse.count,
      } as any,
    };
  }
  async findOneById(id: Entity['id'], option?: ServiceOption): Promise<Nullable<Entity>> {
    const entity = await this.model.findOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
    if (entity) return this.mapper.persistenceToDomain(entity as Schema);

    return null;
  }

  async updateById(
    id: Entity['id'],
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<Nullable<Entity>> {
    const updateResponse = await this.model.updateOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      body,
      option
    );
    if (!updateResponse) return null;

    return updateResponse as unknown as Entity;
    // return this.mapper.persistenceToDomain(updateResponse as Schema);
  }

  async update(entity: Entity, option?: ServiceOption): Promise<Nullable<Entity>> {
    {
      const updateResponse = await this.model.updateOne(
        { [this.model.uniqueIdentifierField as string]: entity.id } as DBQuery<Schema>,
        this.mapper.domainToPersistence(entity),
        option
      );
      if (updateResponse) return this.mapper.persistenceToDomain(updateResponse as Schema);

      return null;
    }
  }

  async updateMany(
    query: QueryOptions,
    body: Partial<Entity>,
    option?: ServiceOption
  ): Promise<number> {
    const updateResponse = await this.model.updateMany(
      query as DBQuery<Schema>,
      this.mapper.updateDomainToPeristence(body),
      option
    );

    return updateResponse;
  }

  async deleteMany(id: Entity['id'], option?: ServiceOption): Promise<void> {
    await this.model.deleteMany(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
  }

  async deleteById(id: Entity['id'], option?: ServiceOption): Promise<void> {
    const res = await this.model.deleteOne(
      { [this.model.uniqueIdentifierField as string]: id } as DBQuery<Schema>,
      option
    );
    if (!res)
      throw new DomainException(
        coreErrorMessage.DEFAULT_ERROR,
        formatModuleMessage(
          coreErrorMessage.MODULE_CREATION_FAILED,
          `document for collection: ${this.model.modelName}`
        )
      );
  }
}
