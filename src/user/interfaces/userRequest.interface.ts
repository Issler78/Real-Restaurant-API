import { UserRole } from "@/user/enums/userRole.enum";

export interface UserRequest {
  sub: string;
  email: string;
  role: UserRole;
}
