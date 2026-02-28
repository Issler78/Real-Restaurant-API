import { AddressDTO } from '@/order/DTOs/address.dto';
import { OrderItemsDTO } from '@/order/DTOs/orderItems.dto';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { PaymentTiming } from '@/order/enums/paymentTiming.enum';
import { CustomAddressValidation } from '@/order/validations/customAddress.validation';
import { CustomNeedsChangeValidation } from '@/order/validations/customNeedsChange.validation';
import { CustomPaymentTimingValidation } from '@/order/validations/customPaymentTiming.validation';
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

export class CreateCustomerOrderDTO {
  @IsNotEmpty()
  @IsBoolean()
  pickup: boolean;

  @Validate(CustomAddressValidation)
  @ValidateNested()
  @Type(() => AddressDTO)
  address?: AddressDTO;

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

  @ValidateIf(o => o.paymentMethod === PaymentMethod.DEBIT_CARD || o.paymentMethod === PaymentMethod.CRETID_CARD)
  @Validate(CustomPaymentTimingValidation)
  @IsEnum(PaymentTiming)
  paymentTiming?: PaymentTiming;

  @Validate(CustomNeedsChangeValidation)
  @IsOptional()
  @IsBoolean()
  needsChange?: boolean;

  @ValidateIf(o => o.needsChange === true)
  @IsNotEmpty()
  @IsDecimal({ force_decimal: true, decimal_digits: '2' })
  changeFor?: string;
}
