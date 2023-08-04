import { UserEntity } from './../users/entities/user.entity';
import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

// TODO нужно запретить авторизацию если пользователь уже авторизаон?

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async getAuthenticatedUser(email: string, pass: string): Promise<any> {
    try {
      const user = await this.usersService.findByEmail(email);
      await this.verifyPassword(pass, user.password);
      user.password = undefined;
      return user;
    } catch (err) {
      throw new HttpException('Неверные данные', HttpStatus.BAD_REQUEST);
    }
  }

  async verifyPassword(password: string, hashPassword: string) {
    const isPasswordMatching = await bcrypt.compare(password, hashPassword);
    if (!isPasswordMatching) {
      throw new HttpException('Неверный пароль', HttpStatus.BAD_REQUEST);
    }
  }

  async register(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);
    try {
      // перезаписываем в теле запроса пароль на шифрованный
      const createdUser = await this.usersService.create({
        ...dto,
        password: hashedPassword,
      });
      createdUser.password = undefined;
      return {
        createdUser,
        token: this.jwtService.sign({ id: createdUser.id }),
      };
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('Ошибка при регистрации');
    }
  }

  async login(user: UserEntity) {
    return {
      token: this.jwtService.sign({ id: user.id }),
    };
  }
}
