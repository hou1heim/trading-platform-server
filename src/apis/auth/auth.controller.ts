import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entity';

interface IOAuthUser {
  user: Pick<User, 'userNumber' | 'password' | 'name'>;
}

@Controller()
export class AuthController {
  //구글로 로그인 진행. 외부 API는 거의 REST형식

  constructor(
    private readonly authService: AuthService,
  ) {}

  @Get('/login/google')
  @UseGuards(AuthGuard('google'))
  async loginGoogle(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    await this.authService.loginSocial({ req, res });
  }

  @Get('/login/naver')
  @UseGuards(AuthGuard('naver'))
  async loginNaver(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    await this.authService.loginSocial({ req, res });
  }

  @Get('/login/kakao')
  @UseGuards(AuthGuard('kakao'))
  async loginKakao(@Req() req: Request & IOAuthUser, @Res() res: Response) {
    await this.authService.loginSocial({ req, res });
  }
}
