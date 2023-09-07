import { User } from '@prisma/client';

import {
    TLoginReturnType,
    TRegisterReturnType,
    TUserInfo,
    TUserWithPayload,
    UserLoginDto,
    UserRegisterDto,
} from '@app/user';

export interface IUserService {
    registration: (dto: UserRegisterDto) => Promise<User>;
    validateUser: (dto: UserLoginDto, user: User) => Promise<boolean>;
    getUserInfo: (uuid: string) => Promise<TUserInfo>;
    login: (dto: UserLoginDto) => Promise<TLoginReturnType>;
}
