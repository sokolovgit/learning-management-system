import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthService } from './auth.service';

import { Strategy } from 'passport-local';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ usernameField: 'email' });
  }
  async validate(email: string, password: string): Promise<User> {
    const user: User = await this.authService.validateUserWithHashedPassword(
      email,
      password,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    console.log('user in validate (local.strategy)', user);
    return user;
  }
}
