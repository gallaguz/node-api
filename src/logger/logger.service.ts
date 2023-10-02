import * as process from 'process';
import * as util from 'util';

import { injectable } from 'inversify';
import * as winston from 'winston';

import { ILogger } from './logger.interface';
import { LOG_COLOURS, LOG_LEVELS, LOG_LEVELS_MAP } from '../constants';

// const logFileName = 'logs/error.log';
//
// function level(): string {
//     const env: string | undefined = process.env.NODE_ENV || 'development';
//     const isDevelopment = env === 'development';
//     return isDevelopment ? 'debug' : 'warn';
// }

winston.addColors(LOG_COLOURS);

const format = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
        (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
    winston.format((info) => {
        if (info && info.message && typeof info.message === 'object') {
            info.message = JSON.stringify(info.message, null, 2);
        }
        return info;
    })(),
);

const transports: Array<any> = [
    new winston.transports.Console(),
    // new winston.transports.File({
    //     filename: logFileName,
    //     level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
    // }),
    // new winston.transports.File({ filename: logFileName }),
];

@injectable()
export class LoggerService implements ILogger {
    private readonly _instance: winston.Logger;
    constructor() {
        this._instance = winston.createLogger({
            level: process.env.LOG_LEVEL || LOG_LEVELS_MAP[LOG_LEVELS.DEBUG],
            levels: LOG_LEVELS,
            format,
            transports,
        });
    }

    public critical(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.CRITICAL],
            message: this.formatMessage(message),
        });
    }

    public debug(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.DEBUG],
            message: this.formatMessage(message),
        });
    }

    public error(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
            message: this.formatMessage(message),
        });
    }

    public info(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.INFO],
            message: this.formatMessage(message),
        });
    }

    public prompt(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.PROMPT],
            message: this.formatMessage(message),
        });
    }

    public data(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.DATA],
            message: this.formatMessage(message),
        });
    }

    public warning(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.WARNING],
            message: this.formatMessage(message),
        });
    }

    public trace(message: string | number | object): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.TRACE],
            message: this.formatMessage(message),
        });
    }

    public morgan(message: string): void {
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
            message: this.formatMessage(message),
        });
    }

    private formatMessage(message: string | number | object): string {
        return typeof message === 'object'
            ? util.inspect(message, { depth: 4 })
            : message.toString();
    }
}
