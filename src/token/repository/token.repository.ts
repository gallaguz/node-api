import { RefreshToken } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { TRefreshToken, TTokenDecoded, TUuid } from '@app/token';
import { TYPES } from '@app/types';
import { ILogger } from 'src/common/logger';

@injectable()
export class TokenRepository {
    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
    ) {}

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
                this.logger.error(error.message);
            }
            throw error;
        }
    }

    public async findByUserId(userId: TUuid): Promise<Array<RefreshToken>> {
        const where = { user_id: userId, is_active: true };

        return this.prismaService.client.refreshToken.findMany({
            where,
        });
    }
}
