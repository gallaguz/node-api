import { User } from '@prisma/client';

export interface IUserEntity {
    name: string;
    email: string;
    password: string;

    setPassword(passwordHash: string): void;
    hash(password: string, salt: number): Promise<string>;
    compare(password: string): Promise<boolean>;
    toJSON(): Partial<User>;
}
