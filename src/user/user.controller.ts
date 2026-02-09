import { RegisterUserDTO } from '@/user/DTOs/registerUser.dto';
import { UserService } from '@/user/user.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService ) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async create(@Body('user') registerDTO: RegisterUserDTO) {
    return await this.userService.create(registerDTO);
  }
}
