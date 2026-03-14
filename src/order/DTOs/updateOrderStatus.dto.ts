import { OrderStatus } from "@/order/enums/orderStatus.enum";
import { IsEnum, IsNotEmpty } from "class-validator";


export class UpdateOrderStatusDTO{
    @IsNotEmpty()
    @IsEnum(OrderStatus)
    status: OrderStatus;
}