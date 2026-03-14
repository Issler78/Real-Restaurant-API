import { OrderHelperModule } from "@/helpers/order/orderHelper.module";
import { ProductHelperModule } from "@/helpers/product/productHelper.module";
import { AddressEntity } from "@/order/address.entity";
import { OrderController } from "@/order/order.controller";
import { OrderEntity } from "@/order/order.entity";
import { OrderService } from "@/order/order.service";
import { OrderItemsEntity } from "@/order/orderItem.entity";
import { ProductModule } from "@/product/product.module";
import { UserModule } from "@/user/user.module";
import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";


@Module({
    imports: [TypeOrmModule.forFeature([ OrderEntity, AddressEntity ]), UserModule, ProductHelperModule, OrderHelperModule, ProductModule],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule{}