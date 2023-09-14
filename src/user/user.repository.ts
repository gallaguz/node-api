import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { PrismaService } from '@app/database/prisma.service';
import { TRACE_TYPE, Trace } from '@app/decorators/trace';
import { ILogger } from '@app/logger/logger.interface';
import { TUuid } from '@app/token/token.types';
import { IUserEntity } from '@app/user/user.entity.interface';
import { IUserRepository } from '@app/user/user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.PrismaService) private prismaService: PrismaService,
    ) {}

    @Trace(TRACE_TYPE.ASYNC)
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
            if (error instanceof Error) this.loggerService.error(error.message);

            throw new Error('Registration error');
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    async getUserByEmail(email: string): Promise<User | null> {
        const where = { email };

        const user = await this.prismaService.client.user.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }

    @Trace(TRACE_TYPE.ASYNC)
    async getUserByUserId(userId: TUuid): Promise<User | null> {
        const where = { id: userId };

        const user = await this.prismaService.client.user.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }
}
