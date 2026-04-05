import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddMangaDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsNotEmpty()
  auteur: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  nombreDeChapitres?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
