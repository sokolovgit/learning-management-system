import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

import { UserModule } from '../user/user.module';

import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { AbilitiesGuard } from '../common/guards/abilities.guard';
import { AbilitiesModule } from '../abilities/abilities.module';
import { MailerService } from '../mailer/mailer.service';
import { GoogleStrategy } from './google.strategy';

@Module({
  imports: [
    ConfigModule,
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<string>('jwt.expiresIn'),
        },
      }),
    }),
    AbilitiesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    MailerService,
    AbilitiesGuard,
  ],
})
export class AuthModule {}
