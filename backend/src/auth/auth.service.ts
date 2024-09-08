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
import { GoogleProfileDto } from './dtos/google-profile.dto';

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

    return {
      access_token: await this.generateJwtToken(foundUser),
      user: foundUser,
    };
  }

  async register(createUserDto: CreateUserDto): Promise<User> {
    const user =
      await this.userService.createUserWithHashedPasswordOrThrow(createUserDto);

    const token = await this.generateJwtToken(user);

    const url = `http://localhost:3000/api/auth/verify-email?token=${token}`;

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

  async generateJwtToken(user: User) {
    const payload = {
      email: user.email,
      role: user.role as UserRole,
      sub: user.id,
    };

    return this.jwtService.sign(payload);
  }

  async registerOrUpdateGoogleUser(
    googleUser: GoogleProfileDto,
  ): Promise<User> {
    let user = await this.userService.findOneByEmail(googleUser.email);

    if (!user) {
      user = await this.userService.createUserFromGoogleOrThrow(googleUser);
    }

    user = await this.userService.updateUserFromGoogle(user, googleUser);

    return user;
  }
}
