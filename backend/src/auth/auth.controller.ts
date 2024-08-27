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
import { GoogleOathGuard } from '../common/guards/google-oath.guard';

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
  async login(@CurrentUser() loginUserDto: LoginDto) {
    const { access_token, user } =
      await this.authService.loginOrThrow(loginUserDto);

    return {
      access_token,
      user: new UserDto(user),
    };
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
  @Get('me')
  async getCurrentUser(@CurrentUser() user: User) {
    return new UserDto(user);
  }

  @Auth()
  @Post('protected_student')
  async protected_student(@CurrentUser() user: User) {
    return user;
  }

  @Get('google')
  @UseGuards(GoogleOathGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async googleAuth() {
    console.log('google auth is reached');
  }

  @Get('google/callback')
  @UseGuards(GoogleOathGuard)
  async googleAuthCallback(@CurrentUser() user: User, @Res() res: Response) {
    console.log('google auth callback is reached');

    console.log('user:', user);

    const jwtToken = this.authService.generateJwtToken(user);

    console.log('jwtToken:', jwtToken);

    const frontendUrl = this.configService.get<string>('FRONTEND_URL');
    return res.redirect(`${frontendUrl}/dashboard`);
  }
}
