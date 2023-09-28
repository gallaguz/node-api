import * as process from 'process';

import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { BaseController } from '@app/common';
import { IConfigService } from '@app/config';
import { ENV_VARS } from '@app/constants';
import { Trace } from '@app/decorators';
import { ConflictError } from '@app/errors';
import { ILogger } from '@app/logger';
import {
    AuthGuardMiddleware,
    CookiesGuardMiddleware,
    ValidateMiddleware,
} from '@app/middlewares';
import { ITokenService } from '@app/token';
import {
    IUserController,
    IUserService,
    TUserInfo,
    UserEntityFromModel,
    UserLoginDto,
    UserRegisterDto,
} from '@app/user';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.LoggerService) loggerService: ILogger,
        @inject(APP_KEYS.UserService) private userService: IUserService,
        @inject(APP_KEYS.TokenService) private tokenService: ITokenService,
    ) {
        super(loggerService);

        this.bindRoutes([
            {
                path: '/index',
                handler: this.index,
                method: 'get',
            },
            {
                path: '/login',
                handler: this.login,
                method: 'post',
                middlewares: [
                    new ValidateMiddleware(this.loggerService, UserLoginDto),
                ],
            },
            {
                path: '/register',
                handler: this.registration,
                method: 'post',
                middlewares: [
                    new ValidateMiddleware(this.loggerService, UserRegisterDto),
                ],
            },
            {
                path: '/refresh',
                handler: this.refresh,
                method: 'post',
                middlewares: [
                    new CookiesGuardMiddleware(
                        this.loggerService,
                        this.tokenService,
                    ),
                ],
            },
            {
                path: '/info',
                handler: this.info,
                method: 'get',
                middlewares: [new AuthGuardMiddleware(this.loggerService)],
            },
        ]);
    }

    @Trace()
    async index(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            void this.ok(res, { pid: process.pid });
        } catch (error) {
            next(error);
        }
    }

    @Trace()
    async registration(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const newUser: User = await this.userService.registration(req.body);

            if (!newUser) {
                const error = new ConflictError({
                    context: this.constructor.name,
                });

                next(error);
            }

            await this.created(res, { userId: newUser.id });
        } catch (error) {
            next(error);
        }
    }

    @Trace()
    async login(
        req: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { email, password } = req.body;
            const result = await this.userService.login({ email, password });

            if (!result)
                next(new ConflictError({ context: this.constructor.name }));

            const { accessToken, refreshToken } = result;

            const maxAge = Number(
                this.configService.get(ENV_VARS.COOKIES_JWT_REFRESH_TOKEN_EXP),
            );
            res.cookie('refreshToken', refreshToken, {
                maxAge,
                httpOnly: true,
            });
            this.ok(res, { accessToken });
        } catch (error) {
            next(error);
        }
    }

    @Trace()
    async info(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const info: TUserInfo = await this.userService.getUserInfo(
                req.userId,
            );

            const userEntity = new UserEntityFromModel(info.user);

            this.ok(res, { user: userEntity, tokens: info.tokens });
        } catch (error) {
            next(error);
        }
    }

    @Trace()
    async refresh(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { accessToken, refreshToken } =
                await this.userService.refresh(req.userId);

            const maxAge = Number(
                this.configService.get(ENV_VARS.COOKIES_JWT_REFRESH_TOKEN_EXP),
            );
            res.cookie('refreshToken', refreshToken, {
                maxAge,
                httpOnly: true,
            });

            void this.ok(res, { accessToken });
        } catch (error) {
            next(error);
        }
    }
}
