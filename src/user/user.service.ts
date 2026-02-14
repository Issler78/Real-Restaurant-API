import { RegisterDTO } from '@/auth/DTOs/register.dto';
import { CreateUserDTO } from '@/user/DTOs/createUser.dto';
import { UserEntity } from '@/user/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async create(registerDTO: CreateUserDTO|RegisterDTO): Promise<UserEntity> {
    const newUser = new UserEntity(); // create new empty user entity

    Object.assign(newUser, registerDTO); // assign DTO to newUser

    // try save the new user
    try {
      return await this.userRepository.save(newUser);
    } catch (error: any) {
      // if error code of postgres is an unique error (23505)
      if (error.code === '23505') {
        // map with key = field unique and value = error message
        const errorsMap = {
          email: 'This email already exists',
          phone: 'This phone already exists',
        };

        const field = Object.keys(errorsMap).find((key) =>
          String(error.detail ?? '').includes(key),
        ); // try find key on details in error
        throw new HttpException(
          field ? errorsMap[field] : 'Unique field already exists',
          HttpStatus.CONFLICT,
        );
      }

      throw new InternalServerErrorException();
    }
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }
}
