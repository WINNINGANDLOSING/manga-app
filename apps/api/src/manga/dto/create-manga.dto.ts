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

export class CreateMangaDto {
  @IsString()
  title: string;

  // @IsOptional() // Allows this field to be optional
  @IsString()
  description?: string;

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  authors?: string[];

  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  artists?: string[];

  @IsString()
  content_rating?: string;

  @IsString()
  originalLanguage?: string;

  @IsNumber()
  releaseYear?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  formats?: string[];

  @IsString()
  origin?: string;

  // @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  genres?: string[];

  // @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  themes?: string[];

  // @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
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
