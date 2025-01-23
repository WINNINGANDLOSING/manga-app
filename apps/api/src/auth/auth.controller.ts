import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Request,
  Get,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LocalAuthGuard } from './guards/local-strategy/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-strategy/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';
import { GoogleAuthGuard } from './guards/google-auth/google-auth.guard';
import { Public } from './decorators/public.decorator';
import { Roles } from './decorators/roles.decorator';
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // when api auth/register is called
  @Public()
  @Post('signup') // sign up new user
  registerUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.registerUser(createUserDto);
  }

  // when api auth/signin ic called
  /* 
  1. install passport lib with npm: npm i npm@nestjs/passport passport-local
  2. install types of passport local: npm i -D @types/passport-local
  3. create local-strategy.ts in auth/strategies/
    3.1 create a function to validate user with local strategy, see "validateUserWithLocalStrategy" function
  4. create local-auth.ts in auth/guards/local-strategy/
  */

  /// @SetMetadata('IS_PUBLIC', true) // set metadata named 'IS_PUBLIC' to true
  @Public()
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('signin')
  async signinUser(@Request() req) {
    return this.authService.signInUser(req.user.id, req.user.name, req.user.role);
  }

  @Roles('ADMIN', 'EDITOR') // Only admin and editors can access this api
  //@UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req) {
    return {
      message: `Now you are able to access this protected API. This is your User ID ${req.user.id}`,
    };
  }

  @Public()
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.name);
  }

  @Public()
  @UseGuards(GoogleAuthGuard)
  @Get('google/login')
  googleLogin() {}

  @Public()
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallBack(@Req() req, @Res() res) {
    // const response = await this.authService.login(req.user.id);
    // res.redirect(`H`)
    console.log('Google Callback:', req.user);

    const response = await this.authService.signInUser(
      req.user.id,
      req.user.name,
      req.user.role
    );
    // notice: see api/auth/google/callback/route.ts
    // the reason it is 3000/api/auth/google/callback... is because there is directory /api/auth/google/callback and inside it there is a file 'route.ts', and this dir is in the web so it is 3000
    res.redirect(
      `http://localhost:3000/api/auth/google/callback?userId=${response.id}&name=${response.name}&accessToken=${response.accessToken}&refreshToken=${response.refreshToken}&role=${response.role}`,
    );
  }

  @UseGuards(JwtAuthGuard) // ony the signed in user can call this api
  @Post('signout')
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id);
  }
}
