import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { CreateCashierOrderDTO } from '@/order/DTOs/createCashierOrder.dto';
import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { UpdateOrderStatusDTO } from '@/order/DTOs/updateOrderStatus.dto';
import { ISimpleOrderResponse } from '@/order/interfaces/simpleOrderResponse.interface';
import { OrderEntity } from '@/order/order.entity';
import { OrderService } from '@/order/order.service';
import { Roles } from '@/user/decorators/roles.decorator';
import { User } from '@/user/decorators/user.decorator';
import { UserRole } from '@/user/enums/userRole.enum';
import {
  Body,
  Controller,
  Param,
  Post,
  Put,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly productHelper: ProductHelperService,
  ) {}

  @Post()
  @Roles('customer')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  async create(
    @Body('order') newOrderDTO: CreateCustomerOrderDTO,
    @User('sub') currentUserId: string,
  ) {
    const newOrder = await this.orderService.createCustomerOrder(
      newOrderDTO,
      currentUserId,
    );

    return this.generateSimpleResponse(newOrder);
  }

  @Post('/cashier')
  @Roles('cashier')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  async cashierCreate(
    @Body('order') newOrderDTO: CreateCashierOrderDTO,
  ) {
    const newOrder = await this.orderService.createCashierOrder(
      newOrderDTO,
    );

    return this.generateSimpleResponse(newOrder);
  }

  @Put('/status/:id')
  @Roles('waiter')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(new ValidationPipe())
  async updateStatus(@Param('id') orderId: string, @Body('newStatus') newStatus: UpdateOrderStatusDTO){
    const order = await this.orderService.updateStatus(orderId, newStatus);

    return this.generateSimpleResponse(order);
  }

  generateSimpleResponse(order: OrderEntity): ISimpleOrderResponse {
    return {
      order: {
        id: order.id,
        order_status: order.orderStatus,
        payment_method: order.paymentMethod,
        subtotal: this.productHelper.ToDecimal(order.subtotal).toString(),
      },
    };
  }
}
