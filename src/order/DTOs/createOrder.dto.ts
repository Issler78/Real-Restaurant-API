import { OrderItemsDTO } from '@/order/DTOs/orderItems.dto';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { CustomNeedsChangeValidation } from '@/order/validations/customNeedsChange.validation';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDecimal,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  Length,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateOrderDTO {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => OrderItemsDTO)
  items: OrderItemsDTO[];

  @IsOptional()
  @Length(3, 255)
  notes?: string;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @Validate(CustomNeedsChangeValidation)
  @IsOptional()
  @IsBoolean()
  needsChange?: boolean;

  @ValidateIf((o) => o.needsChange === true)
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  changeFor: string;
}
