import { Injectable } from '@nestjs/common';
import { UsersService } from './users/users.service';

@Injectable()
export class AppService {
  constructor(private readonly usersService: UsersService) {}
  getHello(): string {
    return 'Hello World!';
  }
  getProfile(id: number) {
    return this.usersService.findById(id);
  }
}
