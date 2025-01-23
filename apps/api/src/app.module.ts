import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MangaModule } from './manga/manga.module';
import { TagModule } from './tag/tag.module';
import { CreatorsModule } from './creators/creators.module';

@Module({
  imports: [AuthModule, UserModule, ConfigModule.forRoot({isGlobal: true}), MangaModule, TagModule, CreatorsModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
