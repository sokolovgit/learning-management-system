import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDto } from '../user/dtos/user.dto';

import { plainToClass } from 'class-transformer';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUserWithHashedPassword(
    email: string,
    pass: string,
  ): Promise<UserDto> {
    const user = await this.userService.findOneByEmailOrThrow(email);

    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(pass, user.password);

    if (!isValidPassword) {
      return null;
    }

    return plainToClass(UserDto, user);
  }

  async login(user: UserDto) {
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto): Promise<UserDto> {
    const user =
      await this.userService.createUserWithHashedPassword(createUserDto);

    return plainToClass(UserDto, user);
  }
}
