import 'reflect-metadata';
import Prisma from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
// Prisma

import { APP_KEYS } from '@app/app-keys';
import { HttpError } from '@app/errors/http.error';
import { IExceptionFilter } from '@app/filters/exception.filter.interface';
import { ILogger } from '@app/logger/logger.interface';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
    ) {
        this.loggerService.debug(`ExceptionFilter Registered`);
    }

    catch(
        err: Error | HttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (err instanceof HttpError) {
            res.status(err.statusCode).send({
                error: err.message,
                status: err.statusCode,
            });
        } else {
            this.loggerService.error(JSON.stringify(err));

            res.status(500).send({ err: 'Something went wrong' });
        }
        next();
    }
}