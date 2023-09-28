import { NextFunction, Request, Response } from 'express';

import { IConfigService } from '@app/config';
import { ENV_VARS } from '@app/constants';
import { ILogger } from '@app/logger';
import { ITokenService } from '@app/token';

import { IMiddleware } from './middleware.interface';

export class AuthMiddleware implements IMiddleware {
    private readonly secret: string;
    constructor(
        private configService: IConfigService,
        private loggerService: ILogger,
        private tokenService: ITokenService,
    ) {
        this.secret = this.configService.get(ENV_VARS.JWT_ACCESS_SECRET);
    }

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            if (!token) res.status(401).send({ error: 'Not authorized' });

            try {
                const decoded = this.tokenService.validateAccessToken(token);
                req.userId = decoded.userId;
            } catch (error) {
                next(error);
            }
        }
        next();
    }
}
