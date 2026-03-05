import { AddressDTO } from '@/order/DTOs/address.dto';
import { CreateOrderDTO } from '@/order/DTOs/createOrder.dto';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { PaymentTiming } from '@/order/enums/paymentTiming.enum';
import { CustomPaymentTimingValidation } from '@/order/validations/customPaymentTiming.validation';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  Validate,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CreateCustomerOrderDTO extends CreateOrderDTO {
  @IsNotEmpty()
  @IsBoolean()
  pickup: boolean;

  @ValidateIf((o) => o.pickup == false)
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDTO)
  address: AddressDTO;

  @ValidateIf(
    (o) =>
      o.paymentMethod === PaymentMethod.DEBIT_CARD ||
      o.paymentMethod === PaymentMethod.CRETID_CARD,
  )
  @Validate(CustomPaymentTimingValidation)
  @IsEnum(PaymentTiming)
  paymentTiming: PaymentTiming;
}
