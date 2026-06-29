import { AdminAssigner, Assigner } from '../../../shared';
import { SOFT_DELETION_FIELD } from '../../../shared/domain/constants';

export interface CommonSchema {
  _id?: string;
  created?: Assigner | AdminAssigner;
}

export interface BaseSchema extends CommonSchema {
  created?: Assigner;
  updated?: Assigner;
  [SOFT_DELETION_FIELD]?: Assigner; //Soft deletion field
}

export interface AdminBaseSchema extends CommonSchema {
  created?: AdminAssigner;
}
