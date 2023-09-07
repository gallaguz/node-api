import { NextFunction, Request, Response } from 'express';

import { IMiddleware } from '@app/common';

export class AuthGuardMiddleware implements IMiddleware {
    execute(req: Request, res: Response, next: NextFunction): void {
        // TODO change uuid to accessToken and decode token here, find in db user

        console.log(`[AuthGuard] uuid: ${req.userId}`);

        if (req.userId) return next();

        res.status(401).send({ error: 'Not authorized' });
    }
}
