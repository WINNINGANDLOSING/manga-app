import { Module } from '@nestjs/common';
import { MangaService } from './manga.service';
import { MangaController } from './manga.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { AuthService } from 'src/auth/auth.service';
import { LocalStrategy } from 'src/auth/strategies/local-strategy';
import { JwtStrategy } from 'src/auth/strategies/jwt-strategy';
import { RefreshStrategy } from 'src/auth/strategies/refresh-token-strategy';
import { GoogleStrategy } from 'src/auth/strategies/google-strategy';
import { UserService } from 'src/user/user.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-strategy/jwt-auth.guard';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import refreshConfig from 'src/auth/config/refresh.config';
import googleOauthConfig from 'src/auth/config/google-oauth.config';

@Module({
  imports: [
    JwtModule.registerAsync(jwtConfig.asProvider()),
    ConfigModule.forFeature(jwtConfig),
    ConfigModule.forFeature(refreshConfig),
    ConfigModule.forFeature(googleOauthConfig),
  ],
  controllers: [MangaController],
  providers: [MangaService, PrismaService],
})
export class MangaModule {}
