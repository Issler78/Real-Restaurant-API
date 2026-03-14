import { OrderStatus } from '@/order/enums/orderStatus.enum';
import { OrderType } from '@/order/enums/orderType.enum';

const OrderStatusTransitions: Record<OrderType, Partial<Record<OrderStatus, OrderStatus[]>>> = {
  [OrderType.COUNTER]: {
    [OrderStatus.CONFIRMED]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
  },
  [OrderType.DELIVERY]: {
    [OrderStatus.CREATED]: [OrderStatus.CONFIRMED, OrderStatus.CANCELED],
    [OrderStatus.CONFIRMED]: [OrderStatus.PREPARING, OrderStatus.CANCELED],
    [OrderStatus.PREPARING]: [OrderStatus.READY, OrderStatus.CANCELED],
    [OrderStatus.READY]: [OrderStatus.OUT_FOR_DELIVERY],
    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.COMPLETED],
    [OrderStatus.COMPLETED]: [],
    [OrderStatus.CANCELED]: [],
  },
};

export default OrderStatusTransitions;
