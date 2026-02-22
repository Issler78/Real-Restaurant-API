import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { CreateProductDTO } from '@/product/DTOs/createProduct.dto';
import { ListProductsQuery } from '@/product/DTOs/listProductsQuery.dto';
import { IProductResponse } from '@/product/interfaces/productResponse.interface';
import { IProductsResponse } from '@/product/interfaces/productsResponse.interface';
import { ProductEntity } from '@/product/product.entity';
import { ProductService } from '@/product/product.service';
import { Roles } from '@/user/decorators/roles.decorator';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly productHelper: ProductHelperService,
  ) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async create(
    @Body('product') newProductDTO: CreateProductDTO,
  ): Promise<IProductResponse> {
    const newProduct = await this.productService.create(newProductDTO);

    return this.generateResponse(newProduct);
  }

  @Get()
  @UsePipes(
    new ValidationPipe({
      transform: true,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  )
  async getAll(@Query() query: ListProductsQuery): Promise<IProductsResponse> {
    const products = await this.productService.findAll(query);

    return this.generateProductsResponse(products);
  }

  @Get('/:id')
  async getById(@Param('id') productId: string): Promise<IProductResponse> {
    const product = await this.productService.findById(Number(productId));

    return this.generateResponse(product);
  }

  generateProductsResponse(products: ProductEntity[]): IProductsResponse {
    return {
      products: products.map((product) => ({
        id: product.id,
        name: product.name,
        description: product.description,
        price: this.productHelper.ToDecimal(product.price),
        categoryId: product.categoryId,
        available: product.available
      }))
    };
  }

  generateResponse(product: ProductEntity): IProductResponse {
    return {
      product: {
        ...product,
        price: this.productHelper.ToDecimal(product.price),
      },
    };
  }
}
