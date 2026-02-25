import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class AddressDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  street: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 6)
  number: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 50)
  neighborhood: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  city: string;

  @IsNotEmpty()
  @IsString()
  @Length(2, 2)
  state: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 8)
  zipCode: string;

  @IsOptional()
  @IsString()
  @Length(3, 255)
  complement?: string;
}
