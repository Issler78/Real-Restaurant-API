import { UserRequest } from '@/user/interfaces/userRequest.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: keyof UserRequest | undefined, context: ExecutionContext): UserRequest | UserRequest[keyof UserRequest] | null => {
    const req = context.switchToHttp().getRequest();
    const user = req.user;
    if (!user) {
      return null;
    }

    if (data) {
      return user[data];
    }

    return user;
  },
);
