import { User } from '@prisma/client';

export interface IUserEntity {
    name: string;
    email: string;
    password: string;

    setPassword(passwordHash: string): void;
    toJSON(): Partial<User>;
}
