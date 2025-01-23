// import { Inject, Injectable } from '@nestjs/common';
// import { PassportStrategy } from '@nestjs/passport';
// import { ExtractJwt, Strategy } from 'passport-jwt';
// import jwtConfig from '../config/jwt.config';
// import { ConfigType } from '@nestjs/config';
// import { AuthService } from '../auth.service';
// import type { JwtAuthPayload } from '../types/auth-jwtPayload';

// @Injectable()
// export class JwtStrategy extends PassportStrategy(Strategy) {
//   constructor(
//     @Inject(jwtConfig.KEY)
//     private jwtConfiguration: ConfigType<typeof jwtConfig>,
//     private authService: AuthService,
//   ) {
//     super({
//       jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // determines where this strategy should look for jwt for the request, This specifies how the JWT should be extracted from the incoming HTTP request.
//       secretOrKey: jwtConfiguration.secret,
      
//       /* export default registerAs(
//   'jwt',
//   (): JwtModuleOptions => ({
//     secret: process.env.JWT_SECRET_KEY,  <---- here, in jwt.config.ts
//     signOptions: {
//       expiresIn: process.env.JWT_EXPIRES_IN,
//     },
//   }),
// );*/ ignoreExpiration: false, // Determines whether expired tokens should be allowed.
//     });
//   }

//   /* 
//   A payload is the part of a token (like a JWT) that contains the actual data or information you want to send.

//         For example, in a JWT, the payload might include:

//         User ID
//         Username
//         Roles/permissions
//         Expiration time
        
//   */

//     /*
//         When a request is sent to an API endpoint protected by a JWT security guard, the guard activates the JWT strategy. 
//         This strategy looks for a JWT in the request's Authorization header as a Bearer token. 
//         It extracts the token and uses the secret key configured in the JWT strategy to verify and decode it. 
//         If the token is valid, the strategy calls the validate function, passing the decoded payload (the data contained in the JWT) as an argument.
//     */
//   validate(payload: JwtAuthPayload) {
//     const userId = payload.sub;
//     return this.authService.validateUserWithJwtStrategy(userId); // return an object that contains the Id of the user and then the said returning object will be appended to the request object under the property header
//   }
// }
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthService } from '../auth.service';
import jwtConfig from '../config/jwt.config';
import type { JwtAuthPayload } from '../types/auth-jwtPayload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(jwtConfig.KEY)
    private jwtConfiguration: ConfigType<typeof jwtConfig>,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConfiguration.secret,
      ignoreExpiration: false,
    });
  }

  validate(payload: JwtAuthPayload) {
    const userId = payload.sub;
    return this.authService.validateUserWithJwtStrategy(userId);
  }
}
