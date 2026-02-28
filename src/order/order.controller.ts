import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { CreateCashierOrderDTO } from '@/order/DTOs/createCashierOrder.dto';
import { CreateCustomerOrderDTO } from '@/order/DTOs/createCustomerOrder.dto';
import { ISimpleOrderResponse } from '@/order/interfaces/simpleOrderResponse.interface';
import { OrderEntity } from '@/order/order.entity';
import { OrderService } from '@/order/order.service';
import { Roles } from '@/user/decorators/roles.decorator';
import { User } from '@/user/decorators/user.decorator';
import { UserRole } from '@/user/enums/userRole.enum';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService, private readonly productHelper: ProductHelperService) {}

  @Post()
  @Roles('customer', 'cashier')
  @UseGuards(AuthGuard, RolesGuard)
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  async create(@Body('order') newOrderDTO: CreateCustomerOrderDTO, @User('sub') currentUserId: string, @User('role') currentRole: UserRole) {
    const newOrder = await this.orderService.create(newOrderDTO, currentUserId, currentRole)

    return this.generateSimpleResponse(newOrder);
  }

  generateSimpleResponse(newOrder: OrderEntity): ISimpleOrderResponse {
    return {
      order: {
        id: newOrder.id,
        order_status: newOrder.orderStatus,
        payment_method: newOrder.paymentMethod,
        subtotal: this.productHelper.ToDecimal(newOrder.subtotal).toString()
      }
    }
  }
}
