import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { BaseController, ValidateMiddleware, AuthGuard } from '@app/common';
import { IConfigService } from '@app/config';
import { HttpError } from '@app/errors';
import { ILogger } from '@app/logger';
import { TYPES } from '@app/types';
import {
    UserLoginDto,
    UserRegisterDto,
    IUserService,
    IUserController,
} from '@app/users';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UserService) private userService: IUserService,
        @inject(TYPES.ConfigService) private configService: IConfigService,
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
                func: this.register,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
            {
                path: '/info',
                func: this.info,
                method: 'get',
                middlewares: [new AuthGuard()],
            },
        ]);
    }

    async login(
        { body }: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const user = await this.userService.validateUser(body);
        if (!user) return next(new HttpError(401, 'Auth error', 'login'));
        const jwt = await this.signJWT(
            body.email,
            this.configService.get('SECRET'),
        );
        this.ok(res, { jwt });
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.createUser(body);
        if (!result)
            return next(new HttpError(422, 'User exist', 'registration'));

        this.ok(res, { email: result.email, id: result.id });
    }

    async info(
        { user }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const userInfo = await this.userService.getUserInfo(user);
        this.ok(res, { email: userInfo?.email, id: userInfo?.id });
    }

    signJWT(email: string, secret: string): Promise<string> {
        return new Promise((resolve, reject) => {
            sign(
                {
                    email,
                    iat: Math.floor(Date.now() / 1000),
                },
                secret,
                {
                    algorithm: 'HS256',
                },
                (err, token) => {
                    if (err) reject();
                    resolve(token as string);
                },
            );
        });
    }
}
