import { PrismaClient } from '@prisma/client';
import { inject, injectable } from 'inversify';

import { TYPES } from '@app/types';
import { ILogger } from 'src/common/logger';

@injectable()
export class PrismaService {
    client: PrismaClient;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.client = new PrismaClient();
    }

    async connect(): Promise<void> {
        try {
            await this.client.$connect();
            this.logger.log(`[${this.constructor.name}] Connected`);
        } catch (e) {
            if (e instanceof Error) {
                this.logger.error(`[${this.constructor.name}] ${e.message}`);
            }
        }
    }

    async disconnect(): Promise<void> {
        await this.client.$disconnect();
    }
}
