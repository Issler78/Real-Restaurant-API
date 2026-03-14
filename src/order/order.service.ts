import { OrderHelperService } from '@/helpers/order/orderHelper.service';
import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { AddressEntity } from '@/order/address.entity';
import { AddressDTO } from '@/order/DTOs/address.dto';
import { CreateCashierOrderDTO } from '@/order/DTOs/createCashierOrder.dto';
import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { CreateOrderDTO } from '@/order/DTOs/createOrder.dto';
import { OrderItemsDTO } from '@/order/DTOs/orderItems.dto';
import { UpdateOrderStatusDTO } from '@/order/DTOs/updateOrderStatus.dto';
import { OrderStatus } from '@/order/enums/orderStatus.enum';
import { OrderType } from '@/order/enums/orderType.enum';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';
import { PaymentTiming } from '@/order/enums/paymentTiming.enum';
import { OrderEntity } from '@/order/order.entity';
import { OrderItemsEntity } from '@/order/orderItem.entity';
import { ProductService } from '@/product/product.service';
import { UserService } from '@/user/user.service';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
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

    private readonly orderHelper: OrderHelperService,
  ) {}

  async createCashierOrder(
    newOrderDTO: CreateCashierOrderDTO,
  ): Promise<OrderEntity> {
    const order = new OrderEntity();
    Object.assign(order, newOrderDTO);

    order.type = OrderType.COUNTER; // assign type of order (user role always is cashier in this method)

    // cash change
    this.validateCashChange(order, newOrderDTO);

    return await this.create(order);
  }

  async createCustomerOrder(
    newOrderDTO: CreateCustomerOrderDTO,
    currentUserId: string,
  ): Promise<OrderEntity> {
    const order = new OrderEntity();
    Object.assign(order, newOrderDTO);

    order.type = OrderType.DELIVERY; // assign type of order (user role always is customer in this method)

    // if current user id == null (of user decorator), because this route is auth
    if (!currentUserId) {
      throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
    }

    order.customer = await this.userService.findById(currentUserId); // order customer will be actual user

    if (
      (order.pickup && newOrderDTO.address != null) ||
      (order.pickup == false && newOrderDTO.address == null)
    ) {
      throw new HttpException(
        "Address can't be null if pickup is false, if pickup is true, addres can't exists",
        HttpStatus.BAD_REQUEST,
      );
    } else {
      if (order.pickup == false && newOrderDTO.address) {
        await this.createAddress(newOrderDTO.address);
      }
    }

    // delivery fee (for now)
    order.deliveryFee = 799; // 7.99 as cents

    // payment timing
    order.paymentMethod == PaymentMethod.CASH
      ? (order.paymentTiming = PaymentTiming.ON_DELIVERY)
      : null; // check if payment method == cash, if true, payment timing will be ON DELIVERY

    order.paymentMethod == PaymentMethod.PIX
      ? (order.paymentTiming = PaymentTiming.BEFORE)
      : null; // check if payment method == pix, if true, payment timing will be BEFORE

    // check exeptions
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

    // cash change
    this.validateCashChange(order, newOrderDTO);

    return await this.create(order);
  }

  async updateStatus(
    orderId: string,
    newStatus: UpdateOrderStatusDTO,
  ): Promise<OrderEntity> {
    const status = newStatus.status;

    const order = await this.findById(orderId);
    const currentStatus = order.orderStatus;

    

    if (!this.orderHelper.canUpdateStatus(currentStatus, status, order.type)) {
      throw new HttpException(
        'Order status cannot be changed to the provided value',
        HttpStatus.FORBIDDEN,
      );
    }

    try {
      order.orderStatus = status;
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        'It was not possible to update the order status',
      );
    }
  }

  async findById(orderId: string): Promise<OrderEntity> {
    const order = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });

    if (!order) {
      throw new HttpException('Order not found', HttpStatus.NOT_FOUND);
    }

    return order;
  }

  private async create(order: OrderEntity): Promise<OrderEntity> {
    //order items
    const newItems = await this.createOrderItems([...order.items], order); // NEW array with items
    order.items = newItems; // order items get an array of order items

    // total and subtotal
    order.total = order.items.reduce((acc, orderItem) => {
      acc += orderItem.total; // return as cents
      return acc;
    }, 0);

    order.deliveryFee
      ? (order.subtotal = order.total + order.deliveryFee)
      : (order.subtotal = order.total); // check if exists deliveryFee

    // id
    order.id = `ORD-${randomUUID()}`;

    try {
      return await this.orderRepository.save(order);
    } catch (error) {
      throw new InternalServerErrorException(
        `Server cannot save order: ${error}`,
      );
    }
  }

  private async createAddress(addressDTO: AddressDTO): Promise<void> {
    const address = new AddressEntity();
    Object.assign(address, addressDTO);

    try {
      await this.addressRepository.save(address);
    } catch (err) {
      throw new InternalServerErrorException("Server can't save address");
    }
  }

  private async createOrderItems(
    items: OrderItemsDTO[],
    order: OrderEntity,
  ): Promise<OrderItemsEntity[]> {
    let orderItems: OrderItemsEntity[] = [];

    await Promise.all(
      items.map(async (item) => {
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
        };

        Object.assign(newItem, data);

        // save order item in orderItems array
        orderItems.push(newItem);
      }),
    );

    return orderItems;
  }

  private validateCashChange(
    order: OrderEntity,
    newOrderDTO: CreateOrderDTO,
  ): void {
    const isCash = order.paymentMethod === PaymentMethod.CASH; // return true or false
    const needsChangeIsNull = order.needsChange == null; // return true or false

    if (isCash && needsChangeIsNull) {
      throw new HttpException(
        'NeedsChange must be provided when payment method is cash',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!isCash && !needsChangeIsNull) {
      throw new HttpException(
        'NeedsChange cannot exists when payment method is not cash.',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order.needsChange == false && newOrderDTO.changeFor) {
      throw new HttpException(
        'If needs change is false, change for can null',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (order.needsChange == true) {
      // check if not exists change for when needs change is true
      if (!newOrderDTO.changeFor) {
        throw new HttpException(
          'If needs change is true, change for cannot be null',
          HttpStatus.BAD_REQUEST,
        );
      }

      order.changeFor = this.productHelper.ToCents(newOrderDTO.changeFor);
    }
  }
}
