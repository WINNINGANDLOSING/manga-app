import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import jwtConfig from 'src/auth/config/jwt.config';
import refreshConfig from 'src/auth/config/refresh.config';
import googleOauthConfig from 'src/auth/config/google-oauth.config';
import { MangaService } from 'src/manga/manga.service';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/strategies/local-strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { RefreshStrategy } from 'src/auth/strategies/refresh-token-strategy';
import { GoogleStrategy } from 'src/auth/strategies/google-strategy';
import { JwtAuthGuard } from 'src/auth/guards/jwt-strategy/jwt-auth.guard';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [UserController],
  providers: [PrismaService, UserService],
})
export class UserModule {}
