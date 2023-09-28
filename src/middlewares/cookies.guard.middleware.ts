import { NextFunction, Request, Response } from 'express';

import { ILogger } from '@app/logger';
import { ITokenService, TTokenDecoded } from '@app/token';

import { IMiddleware } from './middleware.interface';

export class CookiesGuardMiddleware implements IMiddleware {
    constructor(
        private loggerService: ILogger,
        private tokenService: ITokenService,
    ) {}

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const token = req?.cookies?.refreshToken;
        if (!token) res.status(401).send({ error: 'Not authorized' });

        try {
            const decoded: TTokenDecoded =
                this.tokenService.validateRefreshToken(token);
            req.userId = decoded.userId;

            next();
        } catch (error) {
            if (error instanceof Error) this.loggerService.error(error.message);

            next(error);
        }
    }
}
