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

  async findById(id: number): Promise<ProductEntity> {
    try{
      return await this.productRepository.findOneOrFail({
        where: {
          id
        }
      });
    } catch (error) {
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    }
  }
}
