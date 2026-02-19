import { IsNotEmpty, IsString, Length } from "class-validator";

export class CreateCategoryDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 255)
  name: string;
}
