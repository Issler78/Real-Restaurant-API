import { RegisterUserDTO } from '@/user/DTOs/registerUser.dto';
import { IUserResponse } from '@/user/interfaces/userResponse.interface';
import { UserEntity } from '@/user/user.entity';
import { HttpException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { sign } from 'jsonwebtoken'; 
import { LoginUserDTO } from '@/user/DTOs/loginUser.dto';
import { compare } from 'bcrypt';
import { UserHelperService } from '@/helpers/user/userHelper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

    private readonly userHelper: UserHelperService
  ) {}

  async create(registerDTO: RegisterUserDTO): Promise<UserEntity> {
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

        const field = Object.keys(errorsMap).find(key => String(error.detail ?? '').includes(key)); // try find key on details in error
        throw new HttpException(
          field ? errorsMap[field] : 'Unique field already exists', 
          HttpStatus.CONFLICT
        );

      }

      throw new InternalServerErrorException();
    }
  }

  async login(loginDTO: LoginUserDTO): Promise<UserEntity> {
    const user = await this.findByEmail(loginDTO.email); // try find user by email
    if(!user) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    }

    const matchPassword = await compare(loginDTO.password, user.password); // verify if same password in DB
    if(!matchPassword) {
      throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
    }

    return user;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: {
        email
      }
    });
  }

  async findById(id: string | null): Promise<UserEntity | null> {
    if(!id) {
      return null;
    }
    
    return await this.userRepository.findOne({
      where: {
        id
      }
    });
  }

  generateToken(user: UserEntity): string {
    return sign(
      {
        sub: user.id,
        role: user.role
      },
      process.env.SECRET_KEY
    )
  }

  generateResponse(user: UserEntity): IUserResponse {
    return {
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: this.userHelper.getRolesByString(user.role)
      },
      token: this.generateToken(user)
    };
  }
}
