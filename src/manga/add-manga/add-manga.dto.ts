import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddMangaDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  auteur: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nombreDeChapitres?: number;
}
