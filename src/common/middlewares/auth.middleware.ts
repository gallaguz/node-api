import { NextFunction, Request, Response } from 'express';
// import { verify } from 'jsonwebtoken';

import { ILogger, IMiddleware } from '@app/common';
import { IConfigService } from '@app/config';
import { ITokenService } from '@app/token';

export class AuthMiddleware implements IMiddleware {
    private readonly secret: string;
    constructor(
        private configService: IConfigService,
        private logger: ILogger,
        private tokenService: ITokenService,
    ) {
        this.secret = this.configService.get('JWT_ACCESS_SECRET');
    }

    async execute(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];

            this.logger.debug(`[AuthMiddleware]: token: ${token}`);

            try {
                const decoded = await this.tokenService.validateAccessToken(
                    token,
                );

                this.logger.debug(
                    `[AuthMiddleware]: decoded: ${JSON.stringify(decoded)}`,
                );

                req.userId = decoded.userId;
                next();
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(error.message);
                }
                next(error);
            }

            // verify(token, this.secret, (err, payload) => {
            //     this.logger.log('AuthMiddleware: err', err);
            //     if (err) next();
            //
            //     this.logger.log('AuthMiddleware: payload', payload);
            //
            //     if (payload) {
            //         // TODO get uuid from TokenService
            //         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            //         // @ts-ignore
            //         req.uuid = payload.uuid;
            //         next();
            //     }
            // });
        } else {
            next();
        }
    }
}
