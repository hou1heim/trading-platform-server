import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import 'dotenv/config';

export class JwtGoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: 'http://localhost:3000/login/google',
      scope: ['profile'],
    });
  }
  async validate(accessToken, refreshToken, profile) {
    return {
      userNumber: profile.id,
      name: profile.displayName,
      password: '1234',
    };
  }
}
