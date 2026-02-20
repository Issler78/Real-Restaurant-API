import { ProductService } from "@/product/product.service";
import { Controller } from "@nestjs/common";


@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
}
