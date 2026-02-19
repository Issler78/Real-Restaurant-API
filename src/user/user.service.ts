import { RegisterDTO } from '@/auth/DTOs/register.dto';
import { CreateUserDTO } from '@/user/DTOs/createUser.dto';
import { UpdateUserDTO } from '@/user/DTOs/updateUser.dto';
import { UpdateUserRoleDTO } from '@/user/DTOs/updateUserRole.dto';
import { ListUsersQueryDTO } from '@/user/DTOs/listUsersQuery.dto';
import { UserEntity } from '@/user/user.entity';
import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async findAll(query: ListUsersQueryDTO): Promise<UserEntity[]> {
    const queryBuilder = this.userRepository.createQueryBuilder('user');

    if(query.type) {
      
      const typesFilter = {
        staff: (queryBuilder: SelectQueryBuilder<UserEntity>) => {
          queryBuilder.andWhere('user.role IN (:...roles)', { roles: ['waiter', 'cashier'] })
        },
        customer: (queryBuilder: SelectQueryBuilder<UserEntity>) => {
          queryBuilder.andWhere('user.role = :role', { role: 'customer' })
        }
      };

      typesFilter[query.type](queryBuilder);

    }

    if(query.role) {
      queryBuilder.andWhere('user.role IN (:...roles)', { roles: query.role });
    }

    if(query.email) {
      queryBuilder.andWhere('user.email = :email', { email: query.email });
    }

    if(query.name) {
      queryBuilder.andWhere('user.name ILIKE :name', { name: `%${query.name}%` });
    }

    queryBuilder.andWhere('user.role != :adminrole', { adminrole: 'admin' });

    query.limit ?? queryBuilder.limit(query.limit)
    query.offset ?? queryBuilder.offset(query.offset)

    queryBuilder.orderBy('user.name', 'ASC');

    return await queryBuilder.getMany();
  }

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

  async update(updateDTO: UpdateUserDTO|UpdateUserRoleDTO, id: string): Promise<UserEntity> {
    const user = await this.findById(id);

    Object.assign(user, updateDTO);

    return await this.userRepository.save(user);
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
