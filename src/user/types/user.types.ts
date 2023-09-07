import { User, RefreshToken } from '@prisma/client';

export type TUserWithPayload = User & { refreshToken: RefreshToken };

export type TLoginReturnType = {
    accessToken: string;
    refreshToken: string;
};

export type TRegisterReturnType = User & {
    accessToken: string;
    refreshToken: string;
};

export type TUserInfo = {
    user: User;
    tokens: Array<RefreshToken>;
};
