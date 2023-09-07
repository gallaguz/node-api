import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { IConfigService } from '@app/config';
import { TYPES } from '@app/types';
import { ILogger } from 'src/common/logger';

@injectable()
export class ConfigService implements IConfigService {
    private readonly config: DotenvParseOutput;

    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        const result: DotenvConfigOutput = config();
        if (result.error) {
            this.logger.error(
                `[${this.constructor.name}] Cannot read .env file or its does not exist`,
            );
        } else {
            this.logger.log(`[${this.constructor.name}] .env loaded`);
            this.config = result.parsed as DotenvParseOutput;
        }
    }
    get(key: string): string {
        return this.config[key];
    }
}
