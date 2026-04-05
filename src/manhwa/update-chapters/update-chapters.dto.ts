import { IsInt, Min } from 'class-validator';

export class UpdateChaptersDto {
  @IsInt()
  @Min(1)
  value: number;
}
