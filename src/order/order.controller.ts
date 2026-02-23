import { OrderService } from '@/order/order.service';
import { Controller } from '@nestjs/common';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}
}
