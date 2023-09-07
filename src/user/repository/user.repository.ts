import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { TUuid } from '@app/token';
import { TYPES } from '@app/types';
import { IUserEntity, IUserRepository } from '@app/user';
import { ILogger } from 'src/common/logger';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

    async create(userEntity: IUserEntity): Promise<User> {
        try {
            const data = {
                data: {
                    name: userEntity.name,
                    email: userEntity.email,
                    password: userEntity.password,
                },
            };

            return this.prismaService.client.user.create(data);
        } catch (error) {
            this.logger.error(error);

            throw new Error('Registration error');
        }
    }

    async getUserByEmail(email: string): Promise<User | null> {
        const where = { email };

        const user = await this.prismaService.client.user.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }

    async getUserByUserId(userId: TUuid): Promise<User | null> {
        const where = { id: userId };

        const user = await this.prismaService.client.user.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }
}
