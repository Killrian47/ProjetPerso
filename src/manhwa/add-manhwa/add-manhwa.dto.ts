import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';

export class AddManhwaDto {
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
