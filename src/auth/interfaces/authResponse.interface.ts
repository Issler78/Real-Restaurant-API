import { IUser } from "@/user/interfaces/user.interface"

export interface IAuthResponse {
  user: IUser
  token: string
}