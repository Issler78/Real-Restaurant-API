import { SetMetadata } from "@nestjs/common";


export const ROLES_KEY = 'roles';
// if array = ['value1', 'value2'] => (param1: 'value1', param2: 'value2'...)
// set metadata = as if there were a { roles: ['role'] } inside the function or class
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)