import { Type } from "class-transformer";
import { IsIn, IsNumber, IsOptional, Min } from "class-validator";



export class ListProductsQuery {
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
  readonly product?: string;

  @IsOptional()
  @IsIn(['all'])
  readonly available?: string;
}
