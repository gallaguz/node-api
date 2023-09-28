import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { ILogger } from '@app/logger/logger.interface';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
    ) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.loggerService.info(`Connected`);
        } catch (error) {
            if (error instanceof Error) this.loggerService.error(error.message);
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
        this.loggerService.error(`disconnect`);
    }
}
