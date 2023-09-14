import { User, RefreshToken } from '@prisma/client';

import { TUuid } from '@app/token/token.types';

export type TUserWithPayload = User & { refreshToken: RefreshToken };

export type TLoginReturnType = {
    userId: TUuid;
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
