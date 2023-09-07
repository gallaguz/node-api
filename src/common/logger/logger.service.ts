import { injectable } from 'inversify';
import { Logger } from 'tslog';

import { ILogger } from '@app/common';

@injectable()
export class LoggerService implements ILogger {
    public logger: Logger;

    constructor() {
        this.logger = new Logger({
            displayInstanceName: false,
            displayLoggerName: false,
            displayFilePath: 'hidden',
            displayFunctionName: false,
        });
    }

    log(...args: unknown[]): void {
        this.logger.info(...args);
    }

    trace(...args: unknown[]): void {
        this.logger.trace(...args);
    }

    debug(...args: unknown[]): void {
        this.logger.debug(...args);
    }

    info(...args: unknown[]): void {
        this.logger.info(...args);
    }

    warn(...args: unknown[]): void {
        this.logger.warn(...args);
    }

    error(...args: unknown[]): void {
        this.logger.error(...args);
    }

    fatal(...args: unknown[]): void {
        this.logger.fatal(...args);
    }
}
