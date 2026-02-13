import { AuthRequest } from '@/interfaces/authRequest.interface';
import { UserEntity } from '@/user/user.entity';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { NextFunction, Response } from 'express';
import { UserService } from '@/user/user.service';

@Injectable()
export class OptionalAuthMiddleware implements NestMiddleware {
  constructor( private readonly userService: UserService ){}

  async use(req: AuthRequest, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = new UserEntity(); // request user is an empty user entity
      next();
      return;
    }

    // get only the value of token
    const token = req.headers.authorization.split(' ')[1]; // Token <token>
    try {
      const decode = verify(token, process.env.SECRET_KEY);
      const user = await this.userService.findById(decode.sub) // try find user by sub/id

      req.user = user ?? new UserEntity();
      next();
      return;
    } catch (error: any) {
      req.user = new UserEntity(); // request user is an empty user entity
      next();
      return;
    }
  }
}
