import { User } from '@prisma/client';

import { TUuid } from '@app/token/token.types';
import { IUserEntity } from '@app/user/user.entity.interface';

export interface IUserRepository {
    create: (userEntity: IUserEntity) => Promise<User>;
    getUserByEmail: (email: string) => Promise<User | null>;
    getUserByUserId: (userId: TUuid) => Promise<User | null>;
}
