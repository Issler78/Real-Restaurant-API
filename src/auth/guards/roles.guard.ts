import { ROLES_KEY } from '@/user/decorators/roles.decorator';
import { UserRole } from '@/user/enums/userRole.enum';
import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // get if exists (on roles decorator) in class or method required roles
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const rolesHierarchy = {
      [UserRole.ADMIN]: [UserRole.ADMIN, UserRole.CASHIER, UserRole.WAITER, UserRole.CUSTOMER],
      [UserRole.CASHIER]: [UserRole.CASHIER, UserRole.CUSTOMER],
      [UserRole.WAITER]: [UserRole.WAITER, UserRole.CUSTOMER],
      [UserRole.CUSTOMER]: [UserRole.CUSTOMER],
    };

    // return if, in roles hierarchy[current user role] has the required role (return true of false)
    if(rolesHierarchy[req.user.role].some(role => requiredRoles.includes(role))) {
      return true;
    }

    throw new HttpException("You don't have permission to do that", HttpStatus.FORBIDDEN);
  }
}
