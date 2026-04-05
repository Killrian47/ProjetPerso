import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddManhuaDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  nombreDeChapitres?: number;

  @IsOptional()
  @IsString()
  image?: string;
}
