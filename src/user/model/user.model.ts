import { User } from '@prisma/client';

export class UserModel implements User {
    id: number;
    uuid: string;
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
}
