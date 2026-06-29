import { LogoutDto } from '../domain/dtos/logout';
import { ServiceOption } from '@mr-bio/core/shared';
import { LoggedInDto } from '../domain/dtos/logged-in';
import { VerifyOtpDto } from '../domain/dtos/verify-otp';
import { GenerateOtpDto } from '../domain/dtos/generate-otp';
import { RefreshTokenDto } from '../domain/dtos/refresh-token';
import { LoginDto, GetLoginUserDto } from '../domain/dtos/login';
import { MfaTokenResponse, TokenResponse } from '../domain/dtos/token-response';
import { AuthenticationService } from '../domain/abstractions/authentication-service';

export class AuthenticationServiceBaseDecorator implements AuthenticationService {
  constructor(private authenticationService: AuthenticationService) {}

  async login(loginDto: LoginDto, option?: ServiceOption): Promise<MfaTokenResponse> {
    return await this.authenticationService.login(loginDto, option);
  }

  async generateOtp(
    generateOtpDto: GenerateOtpDto,
    option?: ServiceOption
  ): Promise<TokenResponse> {
    return await this.authenticationService.generateOtp(generateOtpDto, option);
  }

  async verifyOtp(verifyOtpDto: VerifyOtpDto, option?: ServiceOption): Promise<TokenResponse> {
    return await this.authenticationService.verifyOtp(verifyOtpDto, option);
  }

  async getLogInUser(
    loginWithMfaDto: GetLoginUserDto,
    option?: ServiceOption
  ): Promise<LoggedInDto> {
    return await this.authenticationService.getLogInUser(loginWithMfaDto, option);
  }

  async logout(logoutDto: LogoutDto, option?: ServiceOption): Promise<void> {
    return await this.authenticationService.logout(logoutDto, option);
  }

  async refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
    option?: ServiceOption
  ): Promise<LoggedInDto> {
    return await this.authenticationService.refreshAccessToken(refreshTokenDto, option);
  }
}
