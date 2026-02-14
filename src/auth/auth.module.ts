import { AuthController } from "@/auth/auth.controller";
import { AuthService } from "@/auth/auth.service";
import { OptionalAuthMiddleware } from "@/auth/middlewares/optionalAuth.middleware";
import { UserHelperModule } from "@/helpers/user/userHelper.module";
import { UserModule } from "@/user/user.module";
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";



@Module({
  imports: [UserModule, UserHelperModule],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(OptionalAuthMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}