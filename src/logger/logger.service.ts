import process from 'process';

import { injectable } from 'inversify';
import * as winston from 'winston';

import { LOG_COLOURS, LOG_LEVELS, LOG_LEVELS_MAP } from '@app/logger/config';
import { ILogger } from '@app/logger/logger.interface';
const logFileName = 'logs/error.log';

function level(): string {
    const env: string | undefined = process.env.NODE_ENV || 'development';
    const isDevelopment = env === 'development';
    return isDevelopment ? 'debug' : 'warn';
}

winston.addColors(LOG_COLOURS);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
);

const transports: Array<any> = [
    new winston.transports.Console(),
    new winston.transports.File({
        filename: logFileName,
        level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
    }),
    new winston.transports.File({ filename: logFileName }),
];

@injectable()
export class LoggerService implements ILogger {
    private readonly _instance: winston.Logger;
    constructor() {
        this._instance = winston.createLogger({
            level: process.env.LOG_LEVEL,
            levels: LOG_LEVELS,
            format,
            transports,
        });

        // this.critical('critical');
        // this.error('error');
        // this.warning('warning');
        // this.info('info');
        // this.debug('debug');
        // this.trace('trace');
    }

    public critical(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.CRITICAL],
            message: message.toString(),
        });
    }

    public debug(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.DEBUG],
            message: message.toString(),
        });
    }

    public error(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
            message: message.toString(),
        });
    }

    public info(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.INFO],
            message: message.toString(),
        });
    }

    public warning(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.WARNING],
            message: message.toString(),
        });
    }

    public trace(message: string | number): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.TRACE],
            message: message.toString(),
        });
    }

    public morgan(message: string): void {
        console.log(message);
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
            message: message.toString(),
        });
    }
}
// import { injectable } from 'inversify';
// import { Logger } from 'tslog';
//
// import { ILogger } from '@app/logger/logger.interface';
//
// // const log: Logger<ILogObj> = new Logger();
// //
// // log.silly('I am a silly log.');
//
// export enum LOG_LEVELS {
//     METRICS = 1,
//     SILLY = 2,
//     TRACE = 3,
//     DEBUG = 4,
//     INFO = 5,
//     WARN = 6,
//     ERROR = 7,
//     FATAL = 8,
// }
//
// export const LOG_LEVELS_NAMES = {
//     [LOG_LEVELS.METRICS]: 'METRICS',
//     [LOG_LEVELS.SILLY]: 'SILLY',
//     [LOG_LEVELS.TRACE]: 'TRACE',
//     [LOG_LEVELS.DEBUG]: 'DEBUG',
//     [LOG_LEVELS.INFO]: 'INFO',
//     [LOG_LEVELS.WARN]: 'WARN',
//     [LOG_LEVELS.ERROR]: 'ERROR',
//     [LOG_LEVELS.FATAL]: 'FATAL',
// };
//
// @injectable()
// export class LoggerService implements ILogger {
//     public _instance: Logger;
//
//     constructor() {
//         this._instance = new Logger({
//             name: `API`,
//             type: 'pretty',
//             displayInstanceName: true,
//             displayLoggerName: true,
//             displayFilePath: 'hidden',
//             displayFunctionName: false,
//         });
//     }
//
//     public log(...args: unknown[]): void {
//         this._instance.info(...args);
//     }
//
//     public metrics(...args: unknown[]): void {
//         return this.log(
//             LOG_LEVELS.METRICS,
//             LOG_LEVELS_NAMES[LOG_LEVELS.METRICS],
//             ...args,
//         );
//     }
//
//     public silly(...args: unknown[]): void {
//         this.log(LOG_LEVELS.SILLY, LOG_LEVELS_NAMES[LOG_LEVELS.SILLY], ...args);
//     }
//
//     public trace(...args: unknown[]): void {
//         this.log(LOG_LEVELS.TRACE, LOG_LEVELS_NAMES[LOG_LEVELS.TRACE], ...args);
//     }
//
//     public debug(...args: unknown[]): void {
//         this.log(LOG_LEVELS.DEBUG, LOG_LEVELS_NAMES[LOG_LEVELS.DEBUG], ...args);
//     }
//
//     public info(...args: unknown[]): void {
//         this.log(LOG_LEVELS.INFO, LOG_LEVELS_NAMES[LOG_LEVELS.INFO], ...args);
//     }
//
//     public warn(...args: unknown[]): void {
//         this.log(LOG_LEVELS.WARN, LOG_LEVELS_NAMES[LOG_LEVELS.WARN], ...args);
//     }
//
//     public error(...args: unknown[]): void {
//         this.log(LOG_LEVELS.ERROR, LOG_LEVELS_NAMES[LOG_LEVELS.ERROR], ...args);
//     }
//
//     public fatal(...args: unknown[]): void {
//         this.log(LOG_LEVELS.FATAL, LOG_LEVELS_NAMES[LOG_LEVELS.FATAL], ...args);
//     }
// }
