import { CategoryController } from '@/category/category.controller';
import { CategoryEntity } from '@/category/category.entity';
import { CategoryService } from '@/category/category.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ CategoryEntity ])],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
