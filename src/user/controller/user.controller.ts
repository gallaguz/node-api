import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import {
    BaseController,
    ValidateMiddleware,
    AuthGuardMiddleware,
} from '@app/common';
import { CookiesGuardMiddleware } from '@app/common/middlewares/cookies.guard.middleware';
import { IConfigService } from '@app/config';
import { HttpError } from '@app/errors';
import { ITokenService } from '@app/token';
import { TYPES } from '@app/types';
import {
    UserLoginDto,
    UserRegisterDto,
    IUserService,
    IUserController,
    UserEntityFromModel,
    TUserInfo,
} from '@app/user';
import { ILogger } from 'src/common/logger';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.TokenService) private tokenService: ITokenService,
    ) {
        super(loggerService);
        this.bindRoutes([
            {
                path: '/login',
                func: this.login,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserLoginDto)],
            },
            {
                path: '/register',
                func: this.registration,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                path: '/refresh',
                func: this.refresh,
                method: 'post',
                middlewares: [new CookiesGuardMiddleware()],
            },
            {
                path: '/info',
                func: this.info,
                method: 'get',
                middlewares: [new AuthGuardMiddleware()],
            },
        ]);
    }

    async registration(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        try {
            const newUser: User = await this.userService.registration(body);

            if (!newUser) {
                const error = new HttpError(422, 'User exist', 'registration');

                next(error);
            }

            this.created(res, { registration: 'successful', id: newUser.id });
        } catch (error) {
            next(error);
        }
    }

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

    async info(
        { userId }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.debug(`[${this.constructor.name}]: ${userId}`);

        try {
            const info: TUserInfo = await this.userService.getUserInfo(userId);

            const userEntity = new UserEntityFromModel(info.user);

            this.ok(res, { user: userEntity, tokens: info.tokens });
        } catch (error) {
            next(error);
        }
    }

    async refresh(
        req: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const decoded = await this.tokenService.validateRefreshToken(
            req.cookies.refreshToken,
        );

        const { accessToken, refreshToken } = await this.tokenService.refresh(
            decoded,
        );

        const maxAge = Number(
            this.configService.get('COOKIES_JWT_REFRESH_TOKEN_EXP'),
        );
        res.cookie('refreshToken', refreshToken, {
            maxAge,
            httpOnly: true,
        });
        this.ok(res, { accessToken });
    }
}
