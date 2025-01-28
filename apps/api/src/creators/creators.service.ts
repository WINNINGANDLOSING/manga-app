import { Injectable } from '@nestjs/common';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CreatorsService {
  constructor(private readonly prisma: PrismaService) {}
  create(createCreatorDto: CreateCreatorDto) {
    return 'This action adds a new creator';
  }

  async findAll() {
    return await this.prisma.creators.findMany({});
  }

  async findOne(manga_id: number) {
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

  update(id: number, updateCreatorDto: UpdateCreatorDto) {
    return `This action updates a #${id} creator`;
  }

  remove(id: number) {
    return `This action removes a #${id} creator`;
  }
}
