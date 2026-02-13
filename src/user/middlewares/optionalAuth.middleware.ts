import { AuthRequest } from '@/interfaces/authRequest.interface';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserService } from '@/user/user.service';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor( private readonly userService: UserService ){}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      next();
      return;
    }

    // get only the value of token
    const token = req.headers.authorization.split(' ')[1]; // Token <token>
    try {
      const decode = verify(token, process.env.SECRET_KEY);
      const user = await this.userService.findById(decode.sub) // try find user by sub/id

      if (!user){
        next();
        return;
      }

      req.user = {
        sub: decode.sub,
        email: user.email,
        role: decode.role
      };

      next();
      return;
    } catch (error: any) {
      next();
      return;
    }
  }
}
