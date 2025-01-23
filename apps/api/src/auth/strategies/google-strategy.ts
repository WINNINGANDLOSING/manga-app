import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20'; // from google-oauth not passport-jwt
import googleOauthConfig from '../config/google-oauth.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import { VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(googleOauthConfig.KEY)
    private GoogleConfiguration: ConfigType<typeof googleOauthConfig>,
    private authService: AuthService,
  ) {
    super({
      clientID: GoogleConfiguration.clientID,
      clientSecret: GoogleConfiguration.clientSecret,
      callbackURL: GoogleConfiguration.callBackUrl,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ) {
    const user = await this.authService.validateUserWithGoogleAuth({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: '',
    });
    done(null, user);
  }

  //done(null, user)
  // request.user
}
