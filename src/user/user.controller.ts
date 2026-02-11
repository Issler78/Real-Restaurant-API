import { RegisterUserDTO } from '@/user/DTOs/registerUser.dto';
import { IUserResponse } from '@/user/interfaces/userResponse.interface';
import { UserService } from '@/user/user.service';
import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService ) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async create(@Body('user') registerDTO: RegisterUserDTO): Promise<IUserResponse> {
    const newUser = await this.userService.create(registerDTO);

    return this.userService.generateResponse(newUser);
  }
}
