import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomNeedsChangeValidation implements ValidatorConstraintInterface {
  validate(needsChange: boolean, args: ValidationArguments): boolean {
    const dto = args.object as CreateCustomerOrderDTO;
    const payMethod = dto.paymentMethod; // get value of payment method

    if (payMethod == PaymentMethod.CASH) {
      return needsChange != null;
    }

    return needsChange == null;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'If payment method is cash, needs change is required, if payment method not is cash, needs change must not be provided';
  }
}
