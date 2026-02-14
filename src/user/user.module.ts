import { UserHelperModule } from '@/helpers/user/userHelper.module';
import { UserController } from '@/user/user.controller';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ UserEntity ]), UserHelperModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService]
})
export class UserModule {}
