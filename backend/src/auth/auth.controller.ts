import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from '../common/guards/local-auth.guard';
import { ApiBody, ApiTags } from '@nestjs/swagger';

import { UserDto } from '../user/dtos/user.dto';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Request() req: Request & { user: UserDto }) {
    return this.authService.login(req.user);
  }

  @Auth()
  @Post('protected')
  async protected_student(@Request() req: Request & { user: UserDto }) {
    return req.user;
  }
}
