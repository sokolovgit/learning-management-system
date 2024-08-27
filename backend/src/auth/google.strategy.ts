import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth2';
import { ConfigService } from '@nestjs/config';
import { GoogleProfileDto } from './dtos/google-profile.dto';
import { AuthService } from './auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.get<string>('googleOauth.clientId'),
      clientSecret: configService.get<string>('googleOauth.clientSecret'),
      callbackURL: configService.get<string>('googleOauth.callbackURL'),
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    const googleProfileDto = new GoogleProfileDto(profile, accessToken);

    try {
      const user =
        await this.authService.registerOrUpdateGoogleUser(googleProfileDto);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  }
}
