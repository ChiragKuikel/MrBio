import { LogoutDto } from '../dtos/logout';
import { LoggedInDto } from '../dtos/logged-in';
import { VerifyOtpDto } from '../dtos/verify-otp';
import { ServiceOption } from '@mr-bio/core/shared';
import { GenerateOtpDto } from '../dtos/generate-otp';
import { RefreshTokenDto } from '../dtos/refresh-token';
import { LoginDto, GetLoginUserDto } from '../dtos/login';
import { MfaTokenResponse, TokenResponse } from '../dtos/token-response';

export abstract class AuthenticationService {
  abstract login(loginDto: LoginDto, option?: ServiceOption): Promise<MfaTokenResponse>;

  abstract generateOtp(
    generateOtpDto: GenerateOtpDto,
    option?: ServiceOption
  ): Promise<TokenResponse>;

  abstract verifyOtp(verifyOtpDto: VerifyOtpDto, option?: ServiceOption): Promise<TokenResponse>;

  abstract getLogInUser(
    loginWithMfaDto: GetLoginUserDto,
    option?: ServiceOption
  ): Promise<LoggedInDto>;

  abstract logout(logoutDto: LogoutDto, option?: ServiceOption): Promise<void>;

  abstract refreshAccessToken(
    refreshTokenDto: RefreshTokenDto,
    option?: ServiceOption
  ): Promise<LoggedInDto>;
}
