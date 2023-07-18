import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// выполняют код стратегии
export class LocalAuthGuard extends AuthGuard('local') {}
