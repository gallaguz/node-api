import process from 'process';

import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { ILogger } from '@app/logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput;

    constructor(@inject(APP_KEYS.LoggerService) private logger: ILogger) {
        const result: DotenvConfigOutput = config({
            path: process.env.ENV_FILE_PATH,
        });
        if (result.error) {
            this.logger.error(
                `[${this.constructor.name}] Cannot read .env file or its does not exist`,
            );
        } else {
            this.logger.info(`[${this.constructor.name}] .env loaded`);
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key: string): string {
        return this.config[key];
    }
}
