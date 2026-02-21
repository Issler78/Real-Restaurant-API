import { ProductHelperService } from '@/helpers/product/productHelper.service';
import { CreateProductDTO } from '@/product/DTOs/createProduct.dto';
import { ProductEntity } from '@/product/product.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    private readonly productHelper: ProductHelperService,
  ) {}

  async create(newProductDTO: CreateProductDTO): Promise<ProductEntity> {
    const newProduct = this.productRepository.create({
      ...newProductDTO,
      price: this.productHelper.ToCents(newProductDTO.price),
    });

    try {
      return await this.productRepository.save(newProduct);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpException('Product already exists', HttpStatus.CONFLICT);
      }

      throw new InternalServerErrorException();
    }
  }
}
