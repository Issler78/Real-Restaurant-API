import { IUser } from "@/user/interfaces/user.interface"

export interface IUserResponse {
  user: IUser
  token: string
}
