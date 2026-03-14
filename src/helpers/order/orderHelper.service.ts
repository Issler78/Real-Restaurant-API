import { OrderStatus } from "@/order/enums/orderStatus.enum";
import { Injectable } from "@nestjs/common";
import OrderStatusTransitions from "@/order/rules/orderStatusTransition.rule";
import { OrderType } from "@/order/enums/orderType.enum";

@Injectable()
export class OrderHelperService{
    canUpdateStatus(currentStatus: OrderStatus, nextStatus: OrderStatus, orderType: OrderType): boolean {
        // ? = order of type counter, current status can be undefined
        return OrderStatusTransitions[orderType][currentStatus]?.includes(nextStatus) ?? false;
    }
}