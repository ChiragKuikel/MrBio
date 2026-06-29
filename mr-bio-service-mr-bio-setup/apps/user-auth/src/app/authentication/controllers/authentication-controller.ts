import { LoginBody } from './validations/login';
import { LoggedInDto } from '../domain/dtos/logged-in';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { VerifyOtpBody } from './validations/verify-otp';
import { GenerateOtpBody } from './validations/generate-otp';
import { LoginDoc, LogoutDoc, RefreshTokenDoc } from './docs';
import { LoginResponse } from '../presenters/response/login-response';
import { MfaTokenResponse, TokenResponse } from '../domain/dtos/token-response';
import { AuthenticationService } from '../domain/abstractions/authentication-service';
import { Body, Controller, Get, Headers, Post, Res, UseGuards } from '@nestjs/common';
import { RefreshTokenGuard } from '../../../external-lib/nest-js/guards/refresh-token-guard';
import { AuthenticationPresenter } from '../presenters/abstractions/authentication-presenter';
import {
  Anonymous,
  AuthEntityDecorator,
  RefreshTokenHeaderDoc,
  RefreshTokenPayloadDecorator,
  VerificationTokenHeaderDoc,
} from '@mr-bio/core/external-lib';
import {
  ACCESS_TOKEN_EXPIRY_TIME_IN_MIN,
  REFRESH_TOKEN_EXPIRY_TIME_IN_MIN,
  REFRESH_TOKEN_EXPIRY_TIME_IN_MIN_FOR_REMEMBER_ME,
  successMessage,
} from '../../../shared/constants';
import {
  ACCESS_TOKEN_COOKIE_KEY,
  CookieHelper,
  HttpResponse,
  AuthEntity,
  IHttpResponse,
  RefreshTokenPayload,
  REFRESH_TOKEN_COOKIE_KEY,
  UnitOfWork,
  buildHttpResponse,
} from '@mr-bio/core/shared';

@ApiTags('Authentication')
@Controller('auth')
export class AuthenticationController {
  constructor(
    private authService: AuthenticationService,
    private cookieHelper: CookieHelper,
    private unitOfWork: UnitOfWork,
    private presenter: AuthenticationPresenter
  ) {}

  @Anonymous()
  @LoginDoc()
  @Post('/login')
  async login(@Body() body: LoginBody): Promise<IHttpResponse<MfaTokenResponse>> {
    return await this.unitOfWork.execute(async session => {
      const data = await this.authService.login(body, { session });

      return buildHttpResponse(data, successMessage.LOGIN_SUCCESS);
    });
  }

  // @Anonymous()
  // @Post('/otp')
  // async generateOtp(@Body() body: GenerateOtpBody): Promise<IHttpResponse<TokenResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const data = await this.authService.generateOtp(body, { session });

  //     return buildHttpResponse(data, successMessage.OTP_SEND_SUCCESS);
  //   });
  // }

  // @Anonymous()
  // @Post('/otp/verify')
  // async verifyOtp(@Body() body: VerifyOtpBody): Promise<IHttpResponse<TokenResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const data = await this.authService.verifyOtp(body, { session });

  //     return buildHttpResponse(data, successMessage.OTP_VALIDATION_SUCCESS);
  //   });
  // }

  // @Anonymous()
  // @VerificationTokenHeaderDoc()
  // @Get('/users')
  // async getLoginUser(
  //   @Headers(VERIFICATION_TOKEN_HEADER) verificationToken: string,
  //   @Res({ passthrough: true }) response: HttpResponse
  // ): Promise<IHttpResponse<LoginResponse>> {
  //   return await this.unitOfWork.execute(async session => {
  //     const data = await this.authService.getLogInUser({ token: verificationToken }, { session });

  //     this._setLoginCookies(response, data);

  //     return buildHttpResponse(this.presenter.dtoToResponse(data), successMessage.LOGIN_SUCCESS);
  //   });
  // }

  @Post('/refresh-token')
  @Anonymous()
  @RefreshTokenDoc()
  @RefreshTokenHeaderDoc()
  @UseGuards(RefreshTokenGuard)
  async refreshAccessToken(
    @RefreshTokenPayloadDecorator() refreshTokenPayload: RefreshTokenPayload,
    @Res({ passthrough: true }) response: HttpResponse
  ): Promise<IHttpResponse<LoginResponse>> {
    return await this.unitOfWork.execute(async session => {
      const data = await this.authService.refreshAccessToken(
        {
          userId: refreshTokenPayload.userId,
          deviceId: refreshTokenPayload.deviceId,
          sessionId: refreshTokenPayload.sessionId,
        },
        { session }
      );
      this._setLoginCookies(response, data);

      return buildHttpResponse(
        this.presenter.dtoToResponse(data),
        successMessage.TOKEN_REFRESH_SUCCESS
      );
    });
  }

  @Post('/logout')
  @ApiBearerAuth('JWT')
  @LogoutDoc()
  @UseGuards(RefreshTokenGuard)
  async logout(
    @RefreshTokenPayloadDecorator() refreshTokenPayload: RefreshTokenPayload,
    @Res({ passthrough: true }) response: HttpResponse,
    @AuthEntityDecorator() authEntity: AuthEntity
  ): Promise<IHttpResponse<void>> {
    return await this.unitOfWork.execute(async session => {
      const data = await this.authService.logout(
        {
          userId: refreshTokenPayload.userId,
          deviceId: refreshTokenPayload.deviceId,
          sessionId: refreshTokenPayload.sessionId,
        },
        { session, authEntity }
      );

      this.cookieHelper.clear(response, [ACCESS_TOKEN_COOKIE_KEY, REFRESH_TOKEN_COOKIE_KEY]);

      return buildHttpResponse(data, successMessage.LOGOUT_SUCCESS);
    });
  }

  private _setLoginCookies(response: HttpResponse, loginResponse: LoggedInDto) {
    const expiryForRefreshToken = loginResponse.remember
      ? REFRESH_TOKEN_EXPIRY_TIME_IN_MIN_FOR_REMEMBER_ME
      : REFRESH_TOKEN_EXPIRY_TIME_IN_MIN;
    this.cookieHelper.set(response, [
      {
        name: ACCESS_TOKEN_COOKIE_KEY,
        value: loginResponse.accessToken,
        expiryPeriodInMin: ACCESS_TOKEN_EXPIRY_TIME_IN_MIN,
      },
      {
        name: REFRESH_TOKEN_COOKIE_KEY,
        value: loginResponse.refreshToken,
        expiryPeriodInMin: expiryForRefreshToken,
      },
    ]);
  }
}
