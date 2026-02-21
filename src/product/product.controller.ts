import { AuthGuard } from "@/auth/guards/auth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { CreateProductDTO } from "@/product/DTOs/createProduct.dto";
import { ProductService } from "@/product/product.service";
import { Roles } from "@/user/decorators/roles.decorator";
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body('product') newProductDTO: CreateProductDTO){
    return await this.productService.create(newProductDTO);
  }
}
