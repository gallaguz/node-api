import * as process from 'process';

import { injectable } from 'inversify';
import * as winston from 'winston';

import { LOG_COLOURS, LOG_LEVELS, LOG_LEVELS_MAP } from '@app/constants';

import { ILogger } from './logger.interface';
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
            level: process.env.LOG_LEVEL,
            levels: LOG_LEVELS,
            format,
            transports,
        });
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
        this._instance.log({
            level: LOG_LEVELS_MAP[LOG_LEVELS.ERROR],
            message: message.toString(),
        });
    }
}
