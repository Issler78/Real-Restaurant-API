import { User } from '@/user/decorators/user.decorator';
import { LoginUserDTO } from '@/user/DTOs/loginUser.dto';
import { RegisterUserDTO } from '@/user/DTOs/registerUser.dto';
import { UserRequest } from '@/user/interfaces/userRequest.interface';
import { IUserResponse } from '@/user/interfaces/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService ) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async create(@Body('user') registerDTO: RegisterUserDTO): Promise<IUserResponse> {
    const newUser = await this.userService.create(registerDTO);

    return this.userService.generateResponse(newUser);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginDTO: LoginUserDTO): Promise<IUserResponse> {
    const user = await this.userService.login(loginDTO);

    return this.userService.generateResponse(user);
  }

  @Get('/me')
  async getCurrent(@User('sub') userId: string | null) {
    const user = await this.userService.findById(userId)

    return user;
  }
}
