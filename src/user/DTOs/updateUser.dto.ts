import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  @Length(3, 255)
  readonly name?: string;

  @IsOptional()
  @IsString()
  @Length(11, 11)
  readonly phone?: string;
}
