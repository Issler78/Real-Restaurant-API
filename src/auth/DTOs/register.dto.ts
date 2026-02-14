import { IsEmail, IsNotEmpty, IsString, Length } from "class-validator";



export class RegisterDTO {
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
}
