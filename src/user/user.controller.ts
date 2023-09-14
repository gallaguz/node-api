import process from 'process';

import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';

import { APP_KEYS } from '@app/app-keys';
import { BaseController } from '@app/common/base.controller';
import { IConfigService } from '@app/config/config.service.interface';
import { TRACE_TYPE, Trace } from '@app/decorators/trace';
import { HttpError } from '@app/errors/http.error';
import { ILogger } from '@app/logger/logger.interface';
import { AuthGuardMiddleware } from '@app/middlewares/auth.guard.middleware';
import { CookiesGuardMiddleware } from '@app/middlewares/cookies.guard.middleware';
import { ValidateMiddleware } from '@app/middlewares/validate.middleware';
import { ITokenService } from '@app/token/token.service.interface';
import { IUserController } from '@app/user/user.controller.interface';
import { UserEntityFromModel } from '@app/user/user.entity';
import { UserLoginDto } from '@app/user/user.login.dto';
import { UserRegisterDto } from '@app/user/user.register.dto';
import { IUserService } from '@app/user/user.service.interface';
import { TUserInfo } from '@app/user/user.types';

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
                func: this.index,
                method: 'get',
            },
            {
                path: '/login',
                func: this.login,
                method: 'post',
                middlewares: [
                    new ValidateMiddleware(this.loggerService, UserLoginDto),
                ],
            },
            {
                path: '/register',
                func: this.registration,
                method: 'post',
                middlewares: [
                    new ValidateMiddleware(this.loggerService, UserRegisterDto),
                ],
            },
            {
                path: '/refresh',
                func: this.refresh,
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
                func: this.info,
                method: 'get',
                middlewares: [new AuthGuardMiddleware(this.loggerService)],
            },
        ]);
    }

    // @Trace(TRACE_TYPE.ASYNC)
    async index(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            void this.ok(res, { pid: process.pid });
        } catch (error) {
            if (error instanceof Error) this.loggerService.error(error.message);
            next(error);
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    async registration(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const newUser: User = await this.userService.registration(req.body);

            if (!newUser) {
                const error = new HttpError(422, 'User exist', 'registration');

                next(error);
            }

            await this.created(res, {
                registration: 'successful',
                id: newUser.id,
            });
        } catch (error) {
            next(error);
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const email = body.email;
            const password = body.password;
            const result = await this.userService.login({ email, password });

            if (!result) next(new HttpError(401, 'Auth error', 'login'));

            const { accessToken, refreshToken } = result;

            const maxAge = Number(
                this.configService.get('COOKIES_JWT_REFRESH_TOKEN_EXP'),
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

    @Trace(TRACE_TYPE.ASYNC)
    async info(
        { userId }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        // this.loggerService.debug(`[${this.constructor.name}]: ${userId}`);

        try {
            const info: TUserInfo = await this.userService.getUserInfo(userId);

            const userEntity = new UserEntityFromModel(info.user);

            this.ok(res, { user: userEntity, tokens: info.tokens });
        } catch (error) {
            next(error);
        }
    }

    @Trace(TRACE_TYPE.ASYNC)
    async refresh(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const { accessToken, refreshToken } =
                await this.userService.refresh(req.userId);

            const maxAge = Number(
                this.configService.get('COOKIES_JWT_REFRESH_TOKEN_EXP'),
            );
            res.cookie('refreshToken', refreshToken, {
                maxAge,
                httpOnly: true,
            });

            void this.ok(res, { accessToken });
        } catch (error) {
            if (error instanceof Error) {
                this.loggerService.error(error.message);
            }
            next(error);
        }
    }
}
