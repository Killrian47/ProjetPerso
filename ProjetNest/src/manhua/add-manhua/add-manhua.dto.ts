import { IsString, IsNotEmpty, IsOptional, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class AddManhuaDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  nombreDeChapitres?: number;
}
