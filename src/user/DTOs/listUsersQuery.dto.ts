import { UserRole } from '@/user/enums/userRole.enum';
import { Transform, Type } from 'class-transformer';
import { IsEnum, IsIn, IsNotIn, IsNumber, IsOptional, Min } from 'class-validator';

export class ListUsersQueryDTO {
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  readonly offset?: number;

  @IsOptional()
  @Transform(({ value }) => value.trim().toLowerCase() )
  @IsIn(['staff', 'customer'])
  readonly type?: 'staff' | 'customer';

  @IsOptional()
  @Transform(({ value }) => {
    if ( Array.isArray(value) ) return value; // check if query role = ?role=role1&role=role2
    if ( typeof value === 'string' ) return value.split(',').map((value: string) => value.trim() ) // check if query role = ?role=role1,role2 and return an array
    return [];
  })
  @IsEnum(UserRole, { each: true })
  @IsNotIn([UserRole.ADMIN], { each: true })
  readonly role?: UserRole[];

  @IsOptional()
  readonly email?: string;

  @IsOptional()
  readonly name?: string;
}
