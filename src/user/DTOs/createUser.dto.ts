import { UserRole } from "@/user/enums/userRole.enum";
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from "class-validator";



export class CreateUserDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 255)
  password: string;

  @IsNotEmpty()
  @IsString()
  @Length(11, 11)
  phone: string;

  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;
}
