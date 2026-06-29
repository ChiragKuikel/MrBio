import { JwtService } from '@nestjs/jwt';
import { TokenHelper } from '../../shared/domain/abstractions/token-helper';
export declare class JwtTokenHelperImpl implements TokenHelper {
  private jwtService;
  constructor(jwtService: JwtService);
  generate(payload: any, secret: string, expiryInMinutes?: number): string;
  verify(
    token: string,
    secret: string
  ):
    | {
        decodedToken: any;
        isValid: boolean;
        error?: undefined;
      }
    | {
        decodedToken: any;
        error: any;
        isValid: boolean;
      };
  decode(token: string): any;
}
//# sourceMappingURL=jwt-token-helper.d.ts.map
