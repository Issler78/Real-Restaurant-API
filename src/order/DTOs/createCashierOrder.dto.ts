import { CreateOrderDTO } from '@/order/DTOs/createOrder.dto';
import { IsOptional, Length } from 'class-validator';

export class CreateCashierOrderDTO extends CreateOrderDTO {
  @IsOptional()
  @Length(3, 255)
  internalNotes?: string;
}
