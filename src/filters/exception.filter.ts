import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '@app/constants';
import { HttpError } from '@app/errors';
import { ILogger } from '@app/logger';

import { IExceptionFilter } from './exception.filter.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
    ) {
        this.loggerService.debug(`[ ${this.constructor.name} ] Registered`);
    }

    catch(
        err: Error | HttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        this.loggerService.error(JSON.stringify(err));

        if (err instanceof HttpError) {
            res.status(err.statusCode).send({
                error: err.message,
                status: err.statusCode,
            });
        } else {
            res.status(CLIENT_ERROR_CODES.BAD_REQUEST).send({
                err: STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST],
            });
        }
        next();
    }
}
