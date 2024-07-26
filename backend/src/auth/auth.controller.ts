import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { UserDto } from '../user/dtos/user.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { AuthService } from './auth.service';
// import { Action } from '../abilities/enums/abilities.enum';
import { User } from '../user/entities/user.entity';
import { CurrentUser } from '../user/decorators/user.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
  async verifyEmail(@Query('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  @Auth()
  @Post('protected_student')
  async protected_student(@CurrentUser() user: User) {
    return user;
  }
}
