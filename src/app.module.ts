import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormconfig from '@/database/ormconfig';
import { UserModule } from '@/user/user.module';
import { AuthModule } from '@/auth/auth.module';
import { CategoryModule } from '@/category/category.module';
import { ProductModule } from '@/product/product.module';
import { OrderModule } from '@/order/order.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot(ormconfig),
    UserModule,
    AuthModule,
    CategoryModule,
    ProductModule,
    OrderModule
  ]
})
export class AppModule {}
