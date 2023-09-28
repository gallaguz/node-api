import { User } from '@prisma/client';

import { TUuid } from '@app/token';
import { IUserEntity } from '@app/user';

export interface IUserRepository {
    create: (userEntity: IUserEntity) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User | null>;
    getUserByUserId: (userId: TUuid) => Promise<User | null>;
}
