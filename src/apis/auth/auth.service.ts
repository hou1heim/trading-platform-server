import { CACHE_MANAGER, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { Cache } from 'cache-manager';
import * as jwt from 'jsonwebtoken';


@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache
  ) {}

  generateToken({ userFound: user }) {
    const token = this.jwtService.sign(
      { userNumber: user.userNumber, sub: user.id },
      { secret: 'accessKey', expiresIn: '1h' },
    );
    return token;
  }

  setRefreshToken({ userFound: user, res }) {
    const refreshToken = this.jwtService.sign(
      { userNumber: user.userNumber, sub: user.id },
      { secret: 'refreshKey', expiresIn: '2w' },
    );
    res.setHeader('Set-Cookie', `refreshToken=${refreshToken}; path=/;`); //소셜로그인에서 path설정
  }

  async loginSocial({ req, res }) {
    let userFound = await this.userService.findUser({
      userNumber: req.user.userNumber,
    });
    if (!userFound) {
      userFound = await this.userService.create({
        userInput: {
          userNumber: req.user.userNumber,
          name: req.user.name,
          password: req.user.password,
        },
      });
    }
    await this.setRefreshToken({ userFound, res });
    res.redirect('http://localhost:3000');
    return await this.generateToken({ userFound });
  }

  async logoutUser({ context }) {
    let accessToken = context.res.req.headers.authorization.split(" ")[1];
    let refreshToken = context.req.headers.cookie.replace("refreshToken=", "");
    
    let accessExp = this.checkAccessToken({ accessToken });
    let refreshExp = this.checkRefreshToken({ refreshToken });

    await this.cacheManager.set(`accessToken:${accessToken}`, accessToken, {
      ttl: accessExp
    })
    await this.cacheManager.set(`refreshToken:${refreshToken}`, refreshToken, {
      ttl: refreshExp
    })
    return "Successfully Logged Out";
  }

  checkAccessToken({ accessToken }) {
    try {
      let decoded: any = jwt.verify(accessToken, 'accessKey')
      return decoded.exp;
    } catch(error) {
      throw new UnauthorizedException("Error 401: Invalid Access Token")
    }
  }

  checkRefreshToken({ refreshToken }) {
    try {
      let decoded: any = jwt.verify(refreshToken, 'refreshKey')
      return decoded.exp;
    } catch(error) {
      throw new UnauthorizedException("Error 401: Invalid Refresh Token")
    }
  }
}
