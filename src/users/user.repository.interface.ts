import { UserModel } from '@prisma/client';

import { User } from '@app/users';

export interface IUserRepository {
    create: (user: User) => Promise<UserModel>;
    find: (email: string) => Promise<UserModel | null>;
}
