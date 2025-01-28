import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { TagService } from './tag.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Roles('ADMIN')
  @Get()
  findAll(@Request() req) {
    return this.tagService.findAll();
  }

  @Roles('ADMIN')
  @Get(':id')
  findOne(@Param('id') manga_id: number) {
    return this.tagService.findOne(+manga_id);
  }
}
