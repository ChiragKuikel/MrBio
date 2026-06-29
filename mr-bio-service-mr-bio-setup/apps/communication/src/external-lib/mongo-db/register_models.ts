import { INestApplication } from '@nestjs/common';
import { ICommonModel } from '@mr-bio/core/external-lib';
import { MessageModel } from '../../app/repository/models/message-model';
import { MessageTemplateModel } from '../../app/repository/models/message-template-model';

export const getMongoModelsForRegistration = (app: INestApplication<any>): ICommonModel<any>[] => {
  return [app.get(MessageTemplateModel), app.get(MessageModel)];
};
