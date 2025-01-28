import { Injectable } from '@nestjs/common';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TagService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return await this.prisma.tags.findMany({});
  }

  async findOne(manga_id: number) {
    return await this.prisma.manga_tag.findMany({
      where: {
        manga_id: manga_id,
      },
      include: {
        mangas: true,
        tags: true
      },
    });
  }
}
