import { UserModel } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { PrismaService } from '@app/database';
import { TYPES } from '@app/types';
import { User, IUserRepository } from '@app/users';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    async create({ email, password, name }: User): Promise<UserModel> {
        return this.prismaService.client.userModel.create({
            data: {
                email,
                password,
                name,
            },
        });
    }

    async find(email: string): Promise<UserModel | null> {
        return this.prismaService.client.userModel.findFirst({
            where: {
                email,
            },
        });
    }
}
