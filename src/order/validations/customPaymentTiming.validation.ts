import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { PaymentTiming } from '@/order/enums/paymentTiming.enum';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomPaymentTimingValidation implements ValidatorConstraintInterface {
  validate(paymentTiming: PaymentTiming, args: ValidationArguments): boolean {
    const dto = args.object as CreateCustomerOrderDTO;
    const payMethod = dto.paymentMethod; // get value of payment timing

    // checks if payment method == cash or pix, if true, check if payment timing is null, if false (payment method == debit or cretid card), check if payment timing not is null
    if (payMethod == PaymentMethod.CASH || payMethod == PaymentMethod.PIX) {
      return paymentTiming == null;
    } else {
      return paymentTiming != null;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return 'If payment method is cash or pix, payment timing must not be provided. If payment method is debit/cretid cart, payment timing is required';
  }
}
