import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';

import { User } from '../user/entities/user.entity';
import { LoginDto } from './dtos/login.dto';
import { UserRole } from '../user/enums/user-role.enum';
import { MailerService } from '../mailer/mailer.service';

import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private mailerService: MailerService,
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

  async loginOrThrow(user: LoginDto) {
    const foundUser = await this.userService.findOneByEmailOrThrow(user.email);

    if (!foundUser.isEmailVerified) {
      throw new ForbiddenException('Email is not verified');
    }

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
      await this.userService.createUserWithHashedPasswordOrThrow(createUserDto);

    const payload = {
      email: user.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);

    const url = `http://localhost:3000/auth/verify-email?token=${token}`;

    await this.mailerService.sendMail(user.email, 'Verify your email', url);

    return user;
  }

  async verifyEmail(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findOneByIdOrThrow(decoded.sub);

      if (user.isEmailVerified) {
        throw new BadRequestException('Email already verified');
      }

      await this.userService.markEmailAsVerified(user.id);

      return {
        status: 'success',
        message: 'Email verified successfully',
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Invalid or expired token',
      };
    }
  }
}
