import { OptionalAuthMiddleware } from '@/user/middlewares/optionalAuth.middleware';
import { UserController } from '@/user/user.controller';
import { UserEntity } from '@/user/user.entity';
import { UserService } from '@/user/user.service';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ UserEntity ])],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalAuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
