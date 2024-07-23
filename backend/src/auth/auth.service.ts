import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';

import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { UserRole } from '../user/enums/user-role.enum';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserWithHashedPassword(
    email: string,
    pass: string,
  ): Promise<User> {
    const user = await this.userService.findOneByEmailOrThrow(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(pass, user.password);

    if (!isValidPassword) {
      return null;
    }

    return user;
  }

  async login(user: LoginDto) {
    const foundUser = await this.userService.findOneByEmailOrThrow(user.email);

    const payload = {
      email: foundUser.email,
      role: foundUser.role as UserRole,
      sub: foundUser.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user =
      await this.userService.createUserWithHashedPassword(createUserDto);

    return user;
  }
}
