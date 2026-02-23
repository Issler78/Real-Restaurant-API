import { OrderController } from "@/order/order.controller";
import { OrderEntity } from "@/order/order.entity";
import { OrderService } from "@/order/order.service";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([ OrderEntity ])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule{}