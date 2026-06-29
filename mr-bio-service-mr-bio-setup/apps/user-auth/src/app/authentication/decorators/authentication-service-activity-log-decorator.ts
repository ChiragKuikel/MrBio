import { Injectable } from '@nestjs/common';
import { LogoutDto } from '../domain/dtos/logout';
import { LoggedInDto } from '../domain/dtos/logged-in';
import { GetLoginUserDto } from '../domain/dtos/login';
import { successMessage } from '../../../shared/constants';
import { AuthenticationService } from '../domain/abstractions/authentication-service';
import { ActivityLogPublisher, ProjectModule, ServiceOption } from '@mr-bio/core/shared';
import { AuthenticationServiceBaseDecorator } from './authentication-service-base-decorator';

@Injectable()
export class AuthenticationServiceActivityLogDecorator extends AuthenticationServiceBaseDecorator {
  module: ProjectModule = ProjectModule.AUTH;

  constructor(
    authenticationService: AuthenticationService,
    private activityLogPublisher: ActivityLogPublisher
  ) {
    super(authenticationService);
  }

  async getLogInUser(
    loginWithMfaDto: GetLoginUserDto,
    option?: ServiceOption
  ): Promise<LoggedInDto> {
    const loginResponse = await super.getLogInUser(loginWithMfaDto, option);

    this._publishLoginActivityLog(loginResponse);

    return loginResponse;
  }

  async logout(logoutDto: LogoutDto, option?: ServiceOption): Promise<void> {
    await super.logout(logoutDto, option);

    this.activityLogPublisher.publishLogEvent(
      {
        eventType: 'LOGOUT',
        module: this.module,
        userVisibility: true,
        note: successMessage.LOGOUT_SUCCESS,
      },
      option?.authEntity
    );
  }

  private _publishLoginActivityLog(loginResponse: LoggedInDto) {
    this.activityLogPublisher.publishLogEvent(
      {
        eventType: 'LOGIN',
        module: this.module,
        userVisibility: true,
        note: successMessage.LOGIN_SUCCESS,
        attributes: {
          reference: {
            refId: loginResponse.user.id,
            projectModule: ProjectModule.USER,
          },
        },
      },
      loginResponse.user
    );
  }
}
