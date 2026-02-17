import { UserRole } from '@/user/enums/userRole.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateUserRoleDTO {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;
}
