import { PartialType } from '@nestjs/mapped-types';
import {
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
export class UpdateMangaDto {
  @IsString()
  manga_id: string;

  @IsString()
  title: string;

  // @IsOptional() // Allows this field to be optional
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  creators?: string[];

  
  @IsString()
  content_rating?: string;

  @IsString()
  originalLanguage?: string;

  @IsNumber()
  releaseYear?: number;

  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  
  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsString()
  status?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alternative_titles?: string[];
}
