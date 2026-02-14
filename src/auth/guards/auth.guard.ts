import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";


@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    // check if exists an user in request
	if(req.user) {
        return true;
    }

    throw new HttpException('Not authorized', HttpStatus.UNAUTHORIZED);
  }
}