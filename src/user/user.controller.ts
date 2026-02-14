import { UserHelperService } from '@/helpers/user/userHelper.service';
import { User } from '@/user/decorators/user.decorator';
import { CreateUserDTO } from '@/user/DTOs/createUser.dto';
import { AuthGuard } from '@/auth/guards/auth.guard';
import { IUserResponse } from '@/user/interfaces/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userHelper: UserHelperService,
  ) {}

  @Post('/create')
  @UsePipes(new ValidationPipe())
  @UseGuards(AuthGuard)
  async create(
    @Body('user') registerDTO: CreateUserDTO,
  ): Promise<IUserResponse> {
    const newUser = await this.userService.create(registerDTO);

    return this.generateResponse(newUser);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getCurrent(@User('sub') userId: string) {
    const user = await this.userService.findById(userId);

    return this.generateResponse(user);
  }

  generateResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: this.userHelper.getRolesByString(user.role),
      },
    };
  }
}
