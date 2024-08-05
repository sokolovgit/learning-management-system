import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { UserDto } from '../user/dtos/user.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { AuthService } from './auth.service';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../user/decorators/user.decorator';

import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    const user: User = await this.authService.register(createUserDto);
    return new UserDto(user);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@CurrentUser() user: LoginDto) {
    return this.authService.loginOrThrow(user);
  }

  @Get('verify-email')
  async verifyEmail(@Query('token') token: string, @Res() res: Response) {
    const result = await this.authService.verifyEmail(token);
    const frontendUrl = this.configService.get<string>('FRONTEND_URL');

    if (result.status === 'success') {
      return res.redirect(`${frontendUrl}/dashboard`);
    }

    console.log('Error verifying email:', result.message);
    return;
  }

  @Auth()
  @Post('protected_student')
  async protected_student(@CurrentUser() user: User) {
    return user;
  }
}
