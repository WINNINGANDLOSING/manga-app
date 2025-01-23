import { Injectable } from '@nestjs/common';
import { CreateMangaDto } from './dto/create-manga.dto';
import { UpdateMangaDto } from './dto/update-manga.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateChapterDto } from './dto/create-chapter.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class MangaService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.mangas.findMany({
      include: {
        chapters: {
          include: {
            pages: true,
          },
        },
      },
    });
  }

  async findOne(mangaId: number) {
    return await this.prisma.mangas.findUnique({
      where: {
        id: mangaId,
      },
      include: {
        chapters: {
          include: {
            pages: true,
          },
        },
      },
    });
  }

  async createNewChapter(createChapterDto: CreateChapterDto) {
    const { mangaId, chapterNumber } = createChapterDto;
    try {
      // Auto-generate the chapter number if not provided or invalid
      const lastChapter = await this.prisma.chapters.findFirst({
        where: { manga_id: mangaId },
        orderBy: { chapter_number: 'desc' },
      });

      // const newChapterNumber = chapterNumber
      //   ? new Decimal(chapterNumber).toNumber() // Convert to number before passing to Prisma
      //   : lastChapter
      //     ? new Decimal(lastChapter.chapter_number).plus(1).toNumber() // Convert to number
      //     : 1; // Default to 1
      const newChapterNumber = chapterNumber
        ? chapterNumber
        : lastChapter
          ? 0
          : 1;

      return await this.prisma.chapters.create({
        data: {
          manga_id: mangaId,
          chapter_number: newChapterNumber,
        },
      });
    } catch (error) {
      console.error('Error creating new chapter: ', error);
      throw new Error('Failed to create new chapter');
    }
  }

  async createNewManga(createMangaDto: CreateMangaDto) {
    try {
      const {
        title,
        description,
        genres,
        cover_image_url,
        view_counts,
        status,
        alternative_titles,
      } = createMangaDto;
      return await this.prisma.mangas.create({
        data: {
          title,
          description,
          genres,
          cover_image_url,
          view_counts,
          status,
          alternative_titles,
        },
      });
    } catch (error) {
      console.error('Error creating new manga: ', error);
      throw new Error('Failed to create new manga');
    }
  }

  async getAuthors(manga_id: number) {
    return await this.prisma.manga_creator.findMany({
      where: {
        manga_id: manga_id,
        role: { in: ['author', 'artist'] },
      },
      include: {
        creators: true,
      },
    });
  }

  async getAuthorsAll() {
    return await this.prisma.creators.findMany({});
  }

  async getTags(manga_id: number) {
    return await this.prisma.manga_tag.findMany({
      where: {
        manga_id: manga_id,
      },
      include: {
        mangas: true,
      },
    });
  }
  getHello(): string {
    return 'Hello World!';
  }
}
