import { NextFunction, Request, Response } from 'express';

import { IMiddleware } from '@app/common';

export class CookiesGuardMiddleware implements IMiddleware {
    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        console.info(
            `[${this.constructor.name}] refreshToken: ${req.cookies.refreshToken}`,
        );

        if (req?.cookies?.refreshToken) return next();

        res.status(401).send({ error: 'Not authorized' });
    }
}
