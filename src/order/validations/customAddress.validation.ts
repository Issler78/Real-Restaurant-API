import { AddressDTO } from '@/order/DTOs/address.dto';
import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class CustomAddressValidation implements ValidatorConstraintInterface {
  validate(address: AddressDTO, args: ValidationArguments): boolean {
    const dto = args.object as CreateCustomerOrderDTO;
    const pickup = dto.pickup; // get value of pickup

    if (pickup === false) {
      return address != null;
    }

    if (pickup === true) {
      return address == null;
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'When pickup is true, address must not be provided. When pickup is false, address is required';
  }
}
