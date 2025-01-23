import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { verify } from 'argon2';
import { JwtAuthPayload } from './types/auth-jwtPayload';
import { JwtService } from '@nestjs/jwt';
import refreshConfig from './config/refresh.config';
import { ConfigType } from '@nestjs/config';
import { Role } from '@prisma/client';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    @Inject(refreshConfig.KEY)
    private refreshTokenConfig: ConfigType<typeof refreshConfig>,
  ) {}
  async registerUser(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email); // find if user with this email already exists in our database
    if (user)
      throw new ConflictException(
        'Another user has already registered with this email.',
      ); // if it is throw an error
    return this.userService.create(createUserDto); // if not create a new user with that email
  }

  async generateToken(userId: number) {
    const payload: JwtAuthPayload = { sub: userId };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload),
      this.jwtService.signAsync(payload, this.refreshTokenConfig), // if don't pass the 2nd argument it will use the default config file which is for creating the jwt access token
    ]);
    return {
      accessToken,
      refreshToken,
    };
  }

  // When user signs in, will geneate a hashed version of the refresh token, and then update the field 'hashedRefreshToken' in the users table

  async signInUser(userId: number, name: string, role:Role) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return { id: userId, name: name, role, accessToken, refreshToken };
  }

  async validateUserWithLocalStrategy(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('User Not Found In Database');
    }
    const isPasswordCorrect = await verify(user.password, password); // parameter: hashedPassword, Inputed Password
    if (!isPasswordCorrect)
      throw new UnauthorizedException('Password is entered incorrectly');

    // user provides a correct username and poassword
    return { id: user.id, name: user.name, role: user.role };
  }

  async validateUserWithJwtStrategy(userId: number) {
    const user = await this.userService.findOne(userId); // remember to use await, or else user will be a promise, which make 'user' will always be true for the below condition check: if(!user)
    if (!user) throw new UnauthorizedException('User Not Found');
    const currentUser = { id: user.id, role: user.role };
    return currentUser;
  }au

  // when user wants to have a new refresh token, create one and create a hashed version of it then update the field hashedRefreshToken in the users table with it
  async refreshToken(userId: number, name: string) {
    const { accessToken, refreshToken } = await this.generateToken(userId);
    const hashedRefreshToken = await argon2.hash(refreshToken);
    await this.userService.updateHashedRefreshToken(userId, hashedRefreshToken);
    return {
      id: userId,
      name: name,
      accessToken,
      refreshToken,
    };
  }

  // and then, when verifying refresh token, get the field hashedRefreshToken from that user, and match it with the hashed refresh token using argon2.verify()
  async validateRefreshToken(userId: number, refreshToken: string) {
    const user = await this.userService.findOne(userId);
    if (!user) throw new UnauthorizedException('User Not Found');
    const isRefreshTokenMatched = await argon2.verify(
      user.hashedRefreshToken,
      refreshToken,
    );
    if (!isRefreshTokenMatched)
      throw new UnauthorizedException('Refresh Token Not Matched.');
    const currentUser = { id: user.id };
    return currentUser;
  }

  async validateUserWithGoogleAuth(googleUser: CreateUserDto) {
    const user = await this.userService.findByEmail(googleUser.email);
    if (user) return user;
    return await this.userService.create(googleUser);
  }

  async signOut(userId: number){
    return await this.userService.updateHashedRefreshToken(userId, null)
  }
}
