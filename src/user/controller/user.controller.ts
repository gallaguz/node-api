import { User } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import {
    BaseController,
    ValidateMiddleware,
    AuthGuardMiddleware,
} from '@app/common';
import { IConfigService } from '@app/config';
import { HttpError } from '@app/errors';
import { TTokens } from '@app/token';
import { TYPES } from '@app/types';
import {
    UserLoginDto,
    UserRegisterDto,
    IUserService,
    IUserController,
    TRegisterReturnType,
    UserEntity,
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
            this.ok<TTokens>(res, { accessToken, refreshToken });
        } catch (error) {
            next(error);
        }
    }

    async info(
        { userId }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        this.logger.debug('[UserController]: ', userId);

        try {
            const info: TUserInfo = await this.userService.getUserInfo(userId);

            const userEntity = new UserEntityFromModel(info.user);

            this.ok(res, { user: userEntity, token: info.token });
        } catch (error) {
            next(error);
        }
    }

    // signJWT(uuid: string, secret: string): Promise<string> {
    //     return new Promise((resolve, reject) => {
    //         sign(
    //             {
    //                 uuid: uuid,
    //                 iat: Math.floor(Date.now() / 1000),
    //             },
    //             secret,
    //             {
    //                 algorithm: 'HS256',
    //             },
    //             (err, token) => {
    //                 if (err) reject();
    //                 resolve(token as string);
    //             },
    //         );
    //     });
    // }
}
