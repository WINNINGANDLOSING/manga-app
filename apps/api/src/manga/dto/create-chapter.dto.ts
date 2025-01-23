import { IsNumber, IsPositive, IsDecimal } from 'class-validator';

export class CreateChapterDto {
  @IsNumber()
  mangaId: number;

  @IsDecimal()
  chapterNumber: number;
}
