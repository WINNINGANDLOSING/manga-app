import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Request,
  Delete,
} from '@nestjs/common';
import { MangaService } from './manga.service';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('manga')
export class MangaController {
  constructor(private readonly mangaService: MangaService) {}

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.mangaService.findOne(+id);
  }

  @Public()
  @Get('tag/:tag')
  async findByTag(@Param('tag') tag: string) {
    return this.mangaService.findByTag(tag);
  }

  @Public()
  @Get('creator/:creator')
  async findByCreator(@Param('creator') creator: string) {
    return this.mangaService.findByCreator(creator);
  }

  @Public()
  @Get()
  async findAll(@Request() req) {
    return this.mangaService.findAll();
  }

  @Roles('ADMIN')
  @Post('createNewChapter')
  createChapter(@Body() createChapterDto: CreateChapterDto) {
    return this.mangaService.createNewChapter(createChapterDto);
  }

  @Roles('ADMIN')
  @Post('createNewManga')
  createManga(@Body() createMangaDto: CreateMangaDto) {
    return this.mangaService.createNewManga(createMangaDto);
  }

  // @Roles('ADMIN')
  // @Post('createNewMangaVer2')
  // createMangaVer2(@Body() createMangaDto: CreateMangaDto) {
  //   return this.mangaService.createNewManga_ver2(createMangaDto);
  // }

  @Roles('ADMIN')
  @Post('editManga')
  editManga(@Body() updateMangaDto: UpdateMangaDto) {
    return this.mangaService.editManga(updateMangaDto);
  }

  @Public()
  @Get('hello')
  getHello(): string {
    return this.mangaService.getHello();
  }
}
