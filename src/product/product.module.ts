import { ProductController } from '@/product/product.controller';
import { ProductEntity } from '@/product/product.entity';
import { ProductService } from '@/product/product.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ ProductEntity ])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
