import { AuthGuard } from '@/auth/guards/auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { CategoryService } from '@/category/category.service';
import { CreateCategoryDTO } from '@/category/DTOs/createCategory.dto';
import { Roles } from '@/user/decorators/roles.decorator';
import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  @Roles('admin')
  @UseGuards(AuthGuard, RolesGuard)
  async create(@Body('category') createCategoryDTO: CreateCategoryDTO){
    return this.categoryService.create(createCategoryDTO);
  }
}
