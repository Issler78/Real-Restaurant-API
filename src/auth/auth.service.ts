import { LoginDTO } from '@/auth/DTOs/login.dto';
import { RegisterDTO } from '@/auth/DTOs/register.dto';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { sign } from 'jsonwebtoken';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(registerDTO: RegisterDTO) {
    return this.userService.create(registerDTO);
  }

  async login(loginDTO: LoginDTO): Promise<UserEntity> {
    const user = await this.userService.findByEmail(loginDTO.email); // try find user by email
    if (!user) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const matchPassword = await compare(loginDTO.password, user.password); // verify if same password in DB
    if (!matchPassword) {
      throw new HttpException(
        'Invalid email or password',
        HttpStatus.UNAUTHORIZED,
      );
    }

    return user;
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        sub: user.id,
        role: user.role,
      },
      process.env.SECRET_KEY,
    );
  }
}
