import { AuthService } from '@/auth/auth.service';
import { IAuthResponse } from '@/auth/interfaces/authResponse.interface';
import { UserHelperService } from '@/helpers/user/userHelper.service';
import { UserEntity } from '@/user/user.entity';
import { RegisterDTO } from '@/auth/DTOs/register.dto';
import { LoginDTO } from '@/auth/DTOs/login.dto';
import {
  Body,
  Controller,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userHelper: UserHelperService,
  ) {}

  @Post('/register')
  @UsePipes(new ValidationPipe())
  async register(
    @Body('user') registerDTO: RegisterDTO,
  ): Promise<IAuthResponse> {
    const newUser = await this.authService.register(registerDTO);

    return this.generateResponse(newUser);
  }

  @Post('/login')
  @UsePipes(new ValidationPipe())
  async login(@Body('user') loginDTO: LoginDTO): Promise<IAuthResponse> {
    const user = await this.authService.login(loginDTO);

    return this.generateResponse(user);
  }

  generateResponse(user: UserEntity): IAuthResponse {
    return {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: this.userHelper.getRolesByString(user.role),
      },
      token: this.authService.generateToken(user),
    };
  }
}
