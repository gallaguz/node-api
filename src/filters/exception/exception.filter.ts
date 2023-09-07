import 'reflect-metadata';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { ILogger } from '@app/common';
import { HttpError } from '@app/errors';
import { IExceptionFilter } from '@app/filters';
import { TYPES } from '@app/types';

@injectable()
export class ExceptionFilter implements IExceptionFilter {
    constructor(@inject(TYPES.ILogger) private logger: ILogger) {
        this.logger.log(`[${this.constructor.name}] Registered`);
    }

    catch(
        err: Error | HttpError,
        req: Request,
        res: Response,
        next: NextFunction,
    ): void {
        if (err instanceof HttpError) {
            this.logger.error(
                `[${err.context}] statusCode: ${err.statusCode}, message: ${err.message}`,
            );

            res.status(err.statusCode).send({
                error: err.message,
                status: err.statusCode,
            });
        } else {
            this.logger.error(`${err.message}`);

            res.status(500).send({ err: err.message });
        }
    }
}
