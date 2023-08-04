import { JwtAuthGuard } from './auth/guards/jwt.guard';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './decorators/user.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  getProfile(@User('id') userId: number) {
    return this.appService.getProfile(userId);
  }
}
