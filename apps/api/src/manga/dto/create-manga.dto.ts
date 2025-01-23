import {
  IsArray,
  IsInt,
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

  

  // @IsOptional()
  @IsArray()
  @IsString({ each: true }) // Ensures each element in the array is a string
  genres?: string[];

  @IsOptional()
  @IsString()
  cover_image_url?: string;

  @IsOptional()
  @IsInt()
  @Min(0) 
  view_counts?: number;

  
  @IsString()
  status?: string; 

  @IsOptional()
  @IsArray()
  @IsString({each: true})
  alternative_titles?: string[]
  
}
