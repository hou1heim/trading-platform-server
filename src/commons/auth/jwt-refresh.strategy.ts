import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';

export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'refreshGuard',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {
    super({
      jwtFromRequest: (req) => {
        const cookie = req.headers.cookie;
        const refreshToken = cookie.replace('refreshToken=', '');
        return refreshToken;
      },
      secretOrKey: 'refreshKey',
      passReqToCallback: true
    });
  }

  async validate(req: any, payload: any) {
    let refreshToken = req.headers.cookie.replace("refreshToken=", "");
    let tokenFound = await this.cacheManager.get(`refreshToken:${refreshToken}`)
    if (tokenFound) throw new UnauthorizedException("Error 401: User Logged Out. Please Login Again.")
    return {
      userNumber: payload.userNumber,
      id: payload.sub,
    };
  }
}
