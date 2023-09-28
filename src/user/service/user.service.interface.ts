import { User } from '@prisma/client';

import { TRefreshToken, TTokens, TUuid } from '@app/token';
import {
    TLoginReturnType,
    TUserInfo,
    UserLoginDto,
    UserRegisterDto,
} from '@app/user';

export interface IUserService {
    registration(dto: UserRegisterDto): Promise<User>;
    login(dto: UserLoginDto): Promise<TLoginReturnType>;
    getUserInfo(uuid: string): Promise<TUserInfo>;
    refresh(refreshToken: TRefreshToken): Promise<TTokens>;
    getUserByIdWithError(userId: TUuid): Promise<User>;
}
