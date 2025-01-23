import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import jwtConfig from '../config/jwt.config';
import { ConfigType } from '@nestjs/config';
import { AuthService } from '../auth.service';
import type { JwtAuthPayload } from '../types/auth-jwtPayload';
import refreshConfig from '../config/refresh.config';
import { Request } from 'express';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh-jwt') {
  //the default name is just 'jwt', change it to refrseh-jwt
  constructor(
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField("refresh"), // determines where this strategy should look for jwt for the request, This specifies how the JWT should be extracted from the incoming HTTP request.
      secretOrKey: refreshTokenConfig.secret, 
      ignoreExpiration: false, // Determines whether expired tokens should be allowed.
      passReqToCallback: true,
    });
  }

  /* 
  A payload is the part of a token (like a JWT) that contains the actual data or information you want to send.

        For example, in a JWT, the payload might include:

        User ID
        Username
        Roles/permissions
        Expiration time
        
  */

  /*
        When a request is sent to an API endpoint protected by a JWT security guard, the guard activates the JWT strategy. 
        This strategy looks for a JWT in the request's Authorization header as a Bearer token. 
        It extracts the token and uses the secret key configured in the JWT strategy to verify and decode it. 
        If the token is valid, the strategy calls the validate function, passing the decoded payload (the data contained in the JWT) as an argument.
    */
  validate(payload: JwtAuthPayload, req:Request) {
    const userId = payload.sub; // extract the user id from the object payload
    const refreshToken = req.body.refresh; // jwtFromRequest: ExtractJwt.fromBodyField("refresh"), we put the refresh token inside a property named 'refresh'
    return this.authService.validateRefreshToken(userId, refreshToken); // return an object that contains the Id of the user and then the said returning object will be appended to the request object under the property header
  }
}
