import { INestApplication } from '@nestjs/common';
import { ICommonModel } from '@mr-bio/core/external-lib';
import { LatencyLogModel } from '../../app/latency-log/repository/models/latency-log-model';
import { ActivityLogModel } from '../../app/activity-log/repository/models/activity-log-model';
import { ExceptionLogModel } from '../../app/exception-log/repository/models/exception-log-model';

export const getMongoModelsForRegistration = (app: INestApplication<any>): ICommonModel<any>[] => {
  const activityLogModel = app.get(ActivityLogModel);
  const exceptionLogModel = app.get(ExceptionLogModel);
  const latencyLogModel = app.get(LatencyLogModel);

  return [activityLogModel, exceptionLogModel, latencyLogModel];
};
