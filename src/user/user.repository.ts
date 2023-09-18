import { User } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { PrismaService } from '@app/database/prisma.service';
import { CatchPrismaError } from '@app/decorators/catch-prisma-error';
import { Trace } from '@app/decorators/trace';
import { ILogger } from '@app/logger/logger.interface';
import { TUuid } from '@app/token/token.types';
import { IUserEntity } from '@app/user/user.entity.interface';
import { IUserRepository } from '@app/user/user.repository.interface';

@injectable()
export class UserRepository implements IUserRepository {
    private _repository;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.PrismaService) prismaService: PrismaService,
    ) {
        this._repository = prismaService.client.user;
    }

    @Trace()
    @CatchPrismaError()
    async create(userEntity: IUserEntity): Promise<User> {
        const data = {
            data: {
                name: userEntity.name,
                email: userEntity.email,
                password: userEntity.password,
            },
        };

        return this._repository.create(data);
    }

    @Trace()
    @CatchPrismaError()
    async getUserByEmail(email: string): Promise<User | null> {
        const where = { email };

        const user: User | null = await this._repository.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }

    @Trace()
    @CatchPrismaError()
    async getUserByUserId(userId: TUuid): Promise<User | null> {
        const where = { id: userId };

        const user: User | null = await this._repository.findFirst({
            where,
        });

        if (!user) return null;

        return user;
    }
}
