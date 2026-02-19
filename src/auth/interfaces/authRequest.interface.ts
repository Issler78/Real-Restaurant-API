import { UserRequest } from '@/user/interfaces/userRequest.interface';
import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: UserRequest
}
