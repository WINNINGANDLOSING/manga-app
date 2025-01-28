import { Controller, Get, Post, Body, Patch, Param, Delete, Request } from '@nestjs/common';
import { CreatorsService } from './creators.service';
import { CreateCreatorDto } from './dto/create-creator.dto';
import { UpdateCreatorDto } from './dto/update-creator.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('creators')
export class CreatorsController {
  constructor(private readonly creatorsService: CreatorsService) {}

  @Post()
  create(@Body() createCreatorDto: CreateCreatorDto) {
    return this.creatorsService.create(createCreatorDto);
  }

  @Public()
  @Get()
  findAll(@Request() req) {
    return this.creatorsService.findAll();
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.creatorsService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateCreatorDto: UpdateCreatorDto) {
  //   return this.creatorsService.update(+id, updateCreatorDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.creatorsService.remove(+id);
  // }
}
