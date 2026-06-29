import { INestApplication } from '@nestjs/common';
import { ICommonModel } from '@mr-bio/core/external-lib';
import { UserModel } from '../../app/user/repository/models/user-model';
import { ClientModel } from '../../app/client/repository/models/client-model';
import { MfaModel } from '../../app/authentication/repository/models/mfa-model';
import { RoleModel } from '../../app/authorization/repository/models/role-model';
import { SessionModel } from '../../app/authentication/repository/models/session-model';
import { ResourceModel } from '../../app/authorization/repository/models/resource-model'; // Add this line

export const getMongoModelsForRegistration = (app: INestApplication<any>): ICommonModel<any>[] => {
  const userModel = app.get(UserModel);
  const otpModel = app.get(MfaModel);
  const sessionModel = app.get(SessionModel);
  const resourceModel = app.get(ResourceModel);
  const roleModel = app.get(RoleModel);
  const clientModel = app.get(ClientModel);

  return [userModel, otpModel, sessionModel, resourceModel, roleModel, clientModel];
};
