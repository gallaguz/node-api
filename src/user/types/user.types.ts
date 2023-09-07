import { Prisma, User, RefreshToken } from '@prisma/client';

import { TRefreshToken } from '@app/token';
// import { DefaultArgs } from '@prisma/client/runtime/library';

const userWithPayload = Prisma.validator<Prisma.UserArgs>()({
    include: { refresh_token: true },
});

// export type TUserWithPayload = Prisma.UserGetPayload<typeof userWithPayload>;
export type TUserWithPayload = User & { refreshToken: RefreshToken };
// export type TUserWithPayload = Prisma.Prisma__UserClient<
//     {
//         refreshToken: RefreshToken | null;
//     } | null,
//     null,
//     DefaultArgs
// >;

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
    token: RefreshToken;
};

// Extract `UsersWithPosts` type with
// type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
// export type UserWithPayload2 = ThenArg<
//     ReturnType<typeof UserRepository.prototype.create>
// >;
