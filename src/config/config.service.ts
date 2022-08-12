import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { ILogger } from '@app/logger';
import { TYPES } from '@app/types';

@injectable()
export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error(
                '[ConfigService] Cannot read .env file or its does not exist',
            );
        } else {
            this.logger.log('[ConfigService] .env loaded');
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key: string): string {
        return this.config[key];
    }
}
