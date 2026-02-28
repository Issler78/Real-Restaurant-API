import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { AddressEntity } from '@/order/address.entity';
import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { OrderItemsDTO } from '@/order/DTOs/orderItems.dto';
import { OrderType } from '@/order/enums/orderType.enum';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { PaymentTiming } from '@/order/enums/paymentTiming.enum';
import { OrderEntity } from '@/order/order.entity';
import { OrderItemsEntity } from '@/order/orderItem.entity';
import { ProductService } from '@/product/product.service';
import { UserRole } from '@/user/enums/userRole.enum';
import { UserService } from '@/user/user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,

    private readonly productService: ProductService,

    private readonly userService: UserService,

    private readonly productHelper: ProductHelperService,
  ) {}

  async create(
    newOrderDTO: CreateCustomerOrderDTO,
    currentUserId: string,
    currentRole: UserRole,
  ) {
    const order = new OrderEntity();
    Object.assign(order, newOrderDTO);

    currentRole == UserRole.CASHIER
      ? (order.type = OrderType.COUNTER)
      : (order.type = OrderType.DELIVERY); // assign type of order by user role

    order.type == OrderType.DELIVERY
      ? (order.customer = await this.userService.findById(currentUserId))
      : null; // if order type == delivery, order customer will be actual user

    // check if order type is delivery and pickup is false
    if (order.type == OrderType.DELIVERY && order.pickup == false) {
      const address = new AddressEntity();
      Object.assign(address, newOrderDTO.address);

      try {
        await this.addressRepository.save(address);
      } catch (err) {
        throw new InternalServerErrorException("Server can't save address");
      }
    }


    // delivery fee (for now)
    order.deliveryFee = 799; // 7.99 as cents


    // payment timing
    order.paymentMethod == PaymentMethod.CASH
      ? (order.paymentTiming = PaymentTiming.ON_DELIVERY)
      : null;
    order.paymentMethod == PaymentMethod.PIX
      ? (order.paymentTiming = PaymentTiming.BEFORE)
      : null;

    if (
      (order.paymentMethod == PaymentMethod.CRETID_CARD ||
        order.paymentMethod == PaymentMethod.DEBIT_CARD) &&
      !order.paymentTiming
    ) {
      throw new HttpException(
        'Payment timing cannot be null if payment method is cretid/debit card',
        HttpStatus.BAD_REQUEST,
      );
    }



    // change
    if (
      (order.paymentMethod == PaymentMethod.CASH &&
        order.needsChange == null) ||
      (order.needsChange != null && order.paymentMethod != PaymentMethod.CASH)
    ) {
      throw new HttpException(
        'Needs change cannot be null if payment method is cash, and has to be null if not is cash',
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (order.needsChange) {
        if (!newOrderDTO.changeFor)
          throw new HttpException(
            'If needs change is true, change for cannot be null',
            HttpStatus.BAD_REQUEST,
          );
        order.changeFor = this.productHelper.ToCents(newOrderDTO.changeFor);
      }
    }



    //order items
    const newItems = await this.createOrderItems([...order.items], order); // NEW array with items
    order.items = newItems; // order items get an array of order items



    // total and subtotal
    order.total = order.items.reduce((acc, orderItem) => {
      acc += orderItem.total; // return as cents
      return acc;
    }, 0);

    order.subtotal = order.total + order.deliveryFee; // only if not include extras discounts

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(`Server can't save order: ${error}`);
    }
  }

  private async createOrderItems(items: OrderItemsDTO[], order: OrderEntity): Promise<OrderItemsEntity[]> {
    let orderItems: OrderItemsEntity[] = [];

    await Promise.all(items.map(async (item) => {
      const newItem = new OrderItemsEntity();
      const product = await this.productService.findById(item.productId); // find each product

      // create an obj with the data of order items
      const data = {
        product: product,
        order: order,
        quantity: item.quantity,
        unitPrice: product.price,
        total: product.price * item.quantity,
        notes: item.notes,
      }

      Object.assign(newItem, data);

      // save order item in orderItems array
      orderItems.push(newItem);
    }))

    return orderItems;
  }
}
