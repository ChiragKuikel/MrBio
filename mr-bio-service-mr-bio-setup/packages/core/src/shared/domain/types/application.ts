import { ICommonModel } from '../../../external-lib';

export type ApplicationInitConfig = {
  mongoDb?: boolean;
  microservice?: boolean;
  mongoModelsToRegsiter?: ICommonModel<any>[];
};
