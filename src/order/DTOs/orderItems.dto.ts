import { IsNotEmpty, IsNumber, IsOptional, Length } from 'class-validator';

export class OrderItemsDTO {
  @IsNotEmpty()
  @IsNumber()
  productId: number;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsOptional()
  @Length(3, 255)
  notes?: string;
}
