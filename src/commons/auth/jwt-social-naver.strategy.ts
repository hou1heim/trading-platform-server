import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-naver-v2';
import 'dotenv/config';

export class JwtNaverStrategy extends PassportStrategy(Strategy, 'naver') {
  constructor() {
    super({
      clientID: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/naver',
      scope: ['profile'],
    });
  }

  async validate(accessToken, refreshToken, profile) {
    return {
      userNumber: profile.id,
      name: profile.name,
      password: '1234',
    };
  }
}
