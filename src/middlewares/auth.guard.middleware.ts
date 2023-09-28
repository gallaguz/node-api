import { NextFunction, Request, Response } from 'express';

import { ILogger } from '@app/logger';

import { IMiddleware } from './middleware.interface';

export class AuthGuardMiddleware implements IMiddleware {
    constructor(private loggerService: ILogger) {}
    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // this.loggerService.info(
        //     `[${this.constructor.name}] uuid: ${req.userId}`,
        // );

        if (req.userId) return next();

        this.loggerService.error('Not authorized');

        res.status(401).send({ error: 'Not authorized' });
    }
}
