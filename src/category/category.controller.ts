import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CategoryEntity } from '@/category/category.entity';
import { CategoryService } from '@/category/category.service';
import { CreateCategoryDTO } from '@/category/DTOs/createCategory.dto';
import { ICategoryResponse } from '@/category/interfaces/categoryResponse.interface';
import { Roles } from '@/user/decorators/roles.decorator';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body('category') createCategoryDTO: CreateCategoryDTO): Promise<ICategoryResponse> {
    const newCategory = await this.categoryService.create(createCategoryDTO);

    return this.generateResponse(newCategory);
  }

  generateResponse(category: CategoryEntity): ICategoryResponse {
    return {
      category: {
        id: category.id,
        name: category.name
      }
    }
  }
}
