import { UserModel } from '@prisma/client';

import { UserLoginDto, UserRegisterDto } from '@app/users/dto';

export interface IUserService {
    createUser: (dto: UserRegisterDto) => Promise<UserModel | null>;
    validateUser: (dto: UserLoginDto) => Promise<boolean>;
    getUserInfo: (email: string) => Promise<UserModel | null>;
}
