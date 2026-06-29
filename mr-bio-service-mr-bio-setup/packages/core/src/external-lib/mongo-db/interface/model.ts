import { IUpdateResponse } from '.';
import { ModelOptions } from './field-option';
import { CountResponse } from '../../../shared';
import { AnyObj } from '../../../shared/domain/types/object';
import { AdminBaseSchema, BaseSchema, CommonSchema } from './schema';
import { CallbackFuncType } from '../../../shared/domain/types/function';
import { FindAllResponse, DBQuery } from '../../../shared/domain/types/query';
import { ICreateOptions, IDbOption, IUpdateOptions, ModelAttributesType } from '../types';
import {
  AggregateOptions,
  BulkWriteOptions,
  Collection,
  FindOneAndUpdateOptions,
  FindOptions,
  WithId,
} from 'mongodb';

export type ICommonModel<EntityType extends CommonSchema> = {
  count(
    query?: DBQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<CountResponse>;
  find(
    query?: DBQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<FindAllResponse<EntityType>>;
  findOne(
    query?: DBQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<WithId<EntityType> | null>;
  findAll(
    query?: DBQuery<EntityType>,
    options?: FindOptions<Document> & IDbOption
  ): Promise<EntityType[]>;
  create(
    body: EntityType,
    options?: FindOptions<Document> & IDbOption & ICreateOptions
  ): Promise<EntityType | string | null>;
  createMany(
    body: EntityType[],
    options?: BulkWriteOptions & IDbOption & ICreateOptions
  ): Promise<EntityType[] | string[]>;
  aggregate(pipeline: any, options?: AggregateOptions): Promise<Array<any>>;
  aggregateUsingWatchModel(pipeline: any, options?: AggregateOptions): Promise<Array<any>>;
} & ModelOptions<EntityType> & {
    readonly modelName: string;
    readonly modelKeys: ModelAttributesType<EntityType>;
    model?: Collection<EntityType>;
    readonly init: CallbackFuncType;
  };

export type IAccessModel<EntityType extends AdminBaseSchema> = ICommonModel<EntityType>;

export type IModel<EntityType extends BaseSchema> = ICommonModel<EntityType> & {
  updateOne(
    query: DBQuery<EntityType>,
    body: Partial<EntityType> | AnyObj,
    options?: FindOneAndUpdateOptions & IUpdateOptions
  ): Promise<WithId<EntityType> | IUpdateResponse<EntityType> | null>;
  updateMany(
    query: DBQuery<EntityType>,
    body: Partial<EntityType> | AnyObj,
    options?: FindOneAndUpdateOptions & IUpdateOptions
  ): Promise<number>;
  deleteOne(query: DBQuery<EntityType>, options?: IDbOption): Promise<{ isDeleted: boolean }>;
  deleteMany(query: DBQuery<EntityType>, options?: IDbOption): Promise<number>;
};
