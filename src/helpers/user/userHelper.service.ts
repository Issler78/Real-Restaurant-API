import { UserRole } from '@/user/enums/userRole.enum';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserHelperService {
  getRolesByString(role: string): UserRole {
    const roles = Object.values(UserRole);
    if (roles.includes(role as UserRole)) {
      return role as UserRole;
    }

    throw new HttpException('Role inválida', HttpStatus.BAD_REQUEST);
  }
}
