import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoryEntity } from '@/category/category.entity';
import { CreateCategoryDTO } from '@/category/DTOs/createCategory.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async create(createCategoryDTO: CreateCategoryDTO): Promise<CategoryEntity> {
    const newCategory = new CategoryEntity();

    Object.assign(newCategory, createCategoryDTO);

    try {
      return await this.categoryRepository.save(newCategory);
    } catch (error: any) {
      if (error.code === '23505') {
        throw new HttpException(
          'Category already exists',
          HttpStatus.CONFLICT,
        );
      }

      throw new InternalServerErrorException();
    }
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({ order: { name: "ASC" } });
  }
}
