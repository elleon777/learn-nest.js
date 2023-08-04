import { LocalAuthGuard } from './guards/local.guards';
import {
  Controller,
  Request,
  Post,
  UseGuards,
  Body,
  HttpCode,
  Res,
  Get,
} from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { Response } from 'express';
import RequestWithUser from './interfaces/requestWithUser.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(200)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req: RequestWithUser, @Res() response: Response) {
    const { user } = req;
    const { password, ...formatUser } = user;
    const { token } = await this.authService.login(formatUser as UserEntity);
    response
      .cookie('access_token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1 * 24 * 60 * 1000),
      })
      .send({ status: 'ok' });
  }

  @HttpCode(201)
  @Post('register')
  register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
  }

  @Post('logout')
  async logout(@Res() response: Response) {
    response.cookie('access_token', '', { expires: new Date() });
    return response.sendStatus(200);
  }
}
