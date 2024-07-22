import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { UserDto } from '../user/dtos/user.dto';

import * as bcrypt from 'bcryptjs';
import { User } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { classToPlain, instanceToPlain } from 'class-transformer';

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

    console.log('foundUser', instanceToPlain(foundUser));
    const payload = {
      user: instanceToPlain(foundUser),
      sub: foundUser.id,
    };
    console.log('payload', payload);
    console.log('this.jwtService.sign(payload)', this.jwtService.sign(payload));
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
