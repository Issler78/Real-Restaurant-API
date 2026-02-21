import { Injectable } from '@nestjs/common';

@Injectable()
export class ProductHelperService {
  ToCents(price: string){
    return Math.round(Number(price) * 100);
  }

  ToDecimal(price: number){
    return Number(price) / 100;
  }
}
