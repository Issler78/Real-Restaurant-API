import { OrderStatus } from '@/order/enums/orderStatus.enum';
import { PaymentMethod } from '@/order/enums/paymentMethod.enum';

export interface ISimpleOrderResponse {
  order: {
    id: string;
    order_status: OrderStatus;
    payment_method: PaymentMethod;
    subtotal: string;
    //estimated_delivery_time: 40
  };
}
