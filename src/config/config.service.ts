import * as process from 'process';

import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config/config.service.interface';
import { APP_ENV, ENV_VARS } from '@app/constants/environment';
import { ILogger } from '@app/logger/logger.interface';

@injectable()
export class ConfigService implements IConfigService {
    public readonly appEnv: APP_ENV;

    constructor(@inject(APP_KEYS.LoggerService) private logger: ILogger) {
        this.appEnv = this.init();

        this.logger.info(`[${this.constructor.name}] env loaded`);
    }
    private init(): APP_ENV {
        const appEnv: string | undefined = process.env.APP_ENV;
        switch (appEnv) {
            case APP_ENV.PRODUCTION:
            case APP_ENV.STAGING:
            case APP_ENV.LOCAL:
            case APP_ENV.DEVELOPMENT:
            case APP_ENV.TESTING:
                return appEnv;
            default:
                throw new Error(`Invalid APP_ENV "${process.env.APP_ENV}"`);
        }
    }

    public get(key: ENV_VARS): string {
        const val = process.env[key];
        if (!val) throw new Error(`Env not found: ${key}`);
        return val;
    }
}
