import { IsDecimal, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";


export class CreateProductDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(3)
  description?: string;

  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  price: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
