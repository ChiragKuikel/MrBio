import { LogoutDto } from './dtos/logout';
import { Injectable } from '@nestjs/common';
import { LoggedInDto } from './dtos/logged-in';
import { VerifyOtpDto } from './dtos/verify-otp';
import { Session } from './core/entities/session';
import { GenerateOtpDto } from './dtos/generate-otp';
import { RefreshTokenDto } from './dtos/refresh-token';
import { MfaService } from './abstractions/mfa-service';
import { LoginDto, GetLoginUserDto } from './dtos/login';
import { MfaAction, MfaType } from './core/entities/mfa';
import { MfaCreatedEvent } from './core/event/mfa-created';
import { User } from '../../user/domain/core/entities/user';
import { MfaUser } from '../../user/domain/core/entities/mfa-user';
import { UserService } from '../../user/domain/abstractions/user-service';
import { AuthenticationService } from './abstractions/authentication-service';
import { SessionRepository } from '../repository/abstractions/session-repository';
import { MfaTokenPayload, MfaTokenResponse, TokenResponse } from './dtos/token-response';
import { UserAuthConfigService } from '../../../shared/abstractions/user-auth-config-service';
import { InvalidCredentialException } from '../../../shared/exception/invalid-credentials-exception';
import { AuthenticationMessagePublisher } from '../messaging/abstractions/authentication-message-publisher';
import {
  ACCESS_TOKEN_EXPIRY_TIME_IN_MIN,
  REFRESH_TOKEN_EXPIRY_TIME_IN_MIN,
  REFRESH_TOKEN_EXPIRY_TIME_IN_MIN_FOR_REMEMBER_ME,
  errorMessage,
} from '../../../shared/constants';
import {
  AuthGrantType,
  AuthUser,
  coreErrorMessage,
  formatModuleMessage,
  getUUID,
  NotFoundException,
  ProjectModule,
  ServiceOption,
  TokenHelper,
  UnauthorizedException,
} from '@mr-bio/core/shared';

@Injectable()
export class AuthenticationServiceImpl implements AuthenticationService {
  constructor(
    private userService: UserService,
    private mfaService: MfaService,
    private sessionRepository: SessionRepository,
    private tokenHelper: TokenHelper,
    private authenticationMessagePublisher: AuthenticationMessagePublisher,
    private configService: UserAuthConfigService
  ) {}

  async login(loginDto: LoginDto, option?: ServiceOption): Promise<MfaTokenResponse> {
    const user = await this.userService.findOneByIdentifier(loginDto.username, option);
    if (!user) {
      throw new InvalidCredentialException();
    }

    if (!user.isActive) {
      throw new UnauthorizedException(errorMessage.ACCOUNT_NOT_ACTIVATED);
    }

    user.login(loginDto.password);
    await this.userService.update(user, option);

    if (user.needMFA) {
      const mfaType = user.needMFA ? MfaType.ONE_TIME_PASSWORD : MfaType.NO_AUTH;
      const mfa = await this.mfaService.createMfa(
        {
          type: mfaType,
          action: MfaAction.LOGIN,
          user: this.userToMfaUser(user),
        },
        option
      );

      this.authenticationMessagePublisher.publishOtpCreatedEvent(new MfaCreatedEvent(mfa));

      return {
        token: mfa.token,
        mfaEnabled: user.needMFA,
      };
    } else {
      const payload = JSON.parse(
        JSON.stringify({
          username: user.username,
          userId: user.id,
          email: user.email,
          roles: user.association?.roles,
          resources: user.association?.resources,
          firstName: user.firstName,
          lastName: user.lastName,
          middleName: user.middleName,
          dob: user.dob,
          gender: user.gender,
          address: user.address,
          phone: user.cellPhone,
          status: user.status,
          tokenId: getUUID(),
        })
      );
      const token = this.tokenHelper.generate(payload, this.configService.auth.authTokenSecret);

      return { token, mfaEnabled: false };
    }
  }

  async generateOtp(
    generateOtpDto: GenerateOtpDto,
    option?: ServiceOption
  ): Promise<TokenResponse> {
    const user = await this.userService.findOneByIdentifier(generateOtpDto.userIdentifier, option);
    if (!user) {
      throw new NotFoundException(
        formatModuleMessage(coreErrorMessage.MODULE_NOT_FOUND, ProjectModule.USER)
      );
    }

    const mfa = await this.mfaService.createMfa(
      {
        action: generateOtpDto.action,
        type: MfaType.ONE_TIME_PASSWORD,
        user: this.userToMfaUser(user),
      },
      option
    );

    this.authenticationMessagePublisher.publishOtpCreatedEvent(new MfaCreatedEvent(mfa));

    return { token: mfa.token };
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, option?: ServiceOption): Promise<TokenResponse> {
    const { verificationToken } = await this.mfaService.verifyMfa(
      {
        type: MfaType.ONE_TIME_PASSWORD,
        action: verifyOtpDto.action,
        token: verifyOtpDto.token,
        code: verifyOtpDto.code,
      },
      option
    );

    return { token: verificationToken };
  }

  async getLogInUser(
    getLoginUserDto: GetLoginUserDto,
    option?: ServiceOption
  ): Promise<LoggedInDto> {
    const mfaTokenPayload: MfaTokenPayload = await this.mfaService.useMfa(
      {
        action: MfaAction.LOGIN,
        verificationToken: getLoginUserDto.token,
      },
      option
    );

    const mfaUser = new MfaUser(mfaTokenPayload.user).asAuthenticated;

    const user = await this.userService.getOneById(mfaUser.id, option);

    user.finishLoginProcess();
    await this.userService.update(user, option);

    const responseUser: AuthUser = this.userToAuthUser(user);
    const userSession = await this.createSession(responseUser.id, undefined, option);

    return {
      accessToken: this.generateAccessToken(responseUser),
      refreshToken: this.generateRefreshToken(userSession),
      user: responseUser,
    };
  }

  async logout(logoutDto: LogoutDto, option: ServiceOption): Promise<void> {
    const user = await this.userService.getOneById(logoutDto.userId, option);

    user.logout();
    await this.userService.update(user, option);
    await this.sessionRepository.deleteUserDeviceSession(
      logoutDto.userId,
      logoutDto.deviceId,
      option
    );

    await this.userService.update(user, option);
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
    option?: ServiceOption
  ): Promise<LoggedInDto> {
    const user = await this.userService.getOneById(refreshTokenDto.userId, option);

    const existingSession = await this.sessionRepository.findOneById(
      refreshTokenDto.sessionId,
      option
    );

    if (!existingSession || existingSession.revoked) {
      throw new UnauthorizedException(errorMessage.SESSION_EXPIRED);
    }

    existingSession.revoke();
    await this.sessionRepository.update(existingSession, option);

    const responseUser: AuthUser = this.userToAuthUser(user);
    const userSession = await this.createSession(responseUser.id, existingSession.remember, option);

    return {
      accessToken: this.generateAccessToken(responseUser),
      refreshToken: this.generateRefreshToken(userSession, existingSession.remember),
      user: responseUser,
      remember: existingSession.remember,
    };
  }

  private generateAccessToken(user: AuthUser): string {
    return this.tokenHelper.generate(
      { ...user },
      this.configService.auth.authTokenSecret,
      ACCESS_TOKEN_EXPIRY_TIME_IN_MIN
    );
  }

  private generateRefreshToken(session: Session, remember?: boolean | undefined): string {
    const expiresIn = remember
      ? REFRESH_TOKEN_EXPIRY_TIME_IN_MIN_FOR_REMEMBER_ME
      : REFRESH_TOKEN_EXPIRY_TIME_IN_MIN;

    return this.tokenHelper.generate(
      {
        sessionId: session.id,
        userId: session.userId,
        deviceId: session.deviceId,
      },
      this.configService.auth.authTokenSecret,
      expiresIn
    );
  }

  private userToAuthUser(user: User): AuthUser {
    return {
      id: user.id,
      email: user.email,
      grantedResources: [],
      lastName: user.lastName,
      firstName: user.firstName,
      fullName: user.getFullName,
      middleName: user.middleName,
      roles: user.association?.roles,
      // organizationId: user.organization.id,
      // organizationName: user.organization.name,
      // networkIds: user.getActiveNetworks().map(n => n.id),
      grantType: AuthGrantType.USER_CREDENTIALS,
    };
  }

  private userToMfaUser(user: User): MfaUser {
    return new MfaUser({
      id: user.id,
      name: {
        lastName: user.lastName,
        firstName: user.firstName,
        middleName: user.middleName,
      },
      email: user.email,
      phone: user.cellPhone,
    });
  }

  private async createSession(
    userId: string,
    remember = false,
    option?: ServiceOption
  ): Promise<Session> {
    const session = new Session();
    session.initialize({
      userId,
      remember,
    });

    return await this.sessionRepository.create(session, option);
  }
}
