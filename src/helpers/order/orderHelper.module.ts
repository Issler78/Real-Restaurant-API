import { OrderHelperService } from "@/helpers/order/orderHelper.service";
import { Module } from "@nestjs/common";



@Module({
    providers: [OrderHelperService],
    exports: [OrderHelperService]
})
export class OrderHelperModule{}