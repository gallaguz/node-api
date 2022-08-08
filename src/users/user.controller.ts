import { BaseController } from '../common';
import { ILogger } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserController } from './user.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { ValidateMiddleware } from '../common/validate.middleware';
import { sign } from 'jsonwebtoken';
import { IConfigService } from '../config/config.service.interface';
import { IUserService } from './user.service.interface';
import { AuthGuard } from '../common/auth.guard';

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
        const jwt = await this.signJWT(body.email, this.configService.get('SECRET'));
        this.ok(res, { jwt });
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.userService.createUser(body);
        if (!result) return next(new HttpError(422, 'User exist'));
        this.ok(res, { email: result.email, id: result.id });
    }

    async info({ user }: Request, res: Response, next: NextFunction): Promise<void> {
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
