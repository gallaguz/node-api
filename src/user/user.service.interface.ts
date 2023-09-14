import { User } from '@prisma/client';

import { TRefreshToken, TTokens, TUuid } from '@app/token/token.types';
import { UserLoginDto } from '@app/user/user.login.dto';
import { UserRegisterDto } from '@app/user/user.register.dto';
import { TLoginReturnType, TUserInfo } from '@app/user/user.types';

export interface IUserService {
    registration(dto: UserRegisterDto): Promise<User>;
    login(dto: UserLoginDto): Promise<TLoginReturnType>;
    getUserInfo(uuid: string): Promise<TUserInfo>;
    refresh(refreshToken: TRefreshToken): Promise<TTokens>;
    getUserByIdWithError(userId: TUuid): Promise<User>;
}
