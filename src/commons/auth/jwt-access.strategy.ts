import { CACHE_MANAGER, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Cache } from 'cache-manager';
import { ExtractJwt, Strategy } from 'passport-jwt';

export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'loginGuard',
) {
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
    ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'accessKey',
      passReqToCallback: true
    });
  }

  async validate(req: any, payload: any) {
    let accessToken = req.headers.authorization.split(" ")[1];
    let tokenFound = await this.cacheManager.get(`accessToken:${accessToken}`)
    if (tokenFound) throw new UnauthorizedException("Error 401: User Logged Out. Please Login Again.")
    return {
      userNumber: payload.userNumber,
      id: payload.sub,
    };
  }
}
