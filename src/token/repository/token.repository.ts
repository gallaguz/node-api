import { RefreshToken } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { CatchPrismaError, Trace } from '@app/decorators';
import { ILogger } from '@app/logger';
import { TRefreshToken, TTokenDecoded, TUuid } from '@app/token';

@injectable()
export class TokenRepository {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.PrismaService) private prismaService: PrismaService,
    ) {}

    @Trace()
    @CatchPrismaError()
    public async create(
        token: TRefreshToken,
        { userId, exp }: TTokenDecoded,
    ): Promise<RefreshToken> {
        try {
            const data = {
                data: { token, user_id: userId, exp },
            };
            return this.prismaService.client.refreshToken.create(data);
        } catch (error) {
            if (error instanceof Error) {
                // TODO
                this.loggerService.error(error.message);
            }
            throw error;
        }
    }

    @Trace()
    @CatchPrismaError()
    public async findByUserId(userId: TUuid): Promise<Array<RefreshToken>> {
        const where = { user_id: userId, is_active: true };

        return this.prismaService.client.refreshToken.findMany({
            where,
            skip: 0,
            take: 10,
        });
    }
}
