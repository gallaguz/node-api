import { BaseController } from '../common';
import { ILogger, LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            { path: '/register', func: this.register, method: 'post' },
        ]);
    }

    login(
        req: Request<{}, {}, UserLoginDto>,
        res: Response,
        next: NextFunction,
    ): void {
        console.log(req.body);
        next(new HttpError(401, 'Auth error', 'login'));
    }

    register(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): void {
        console.log(req.body);
        this.ok(res, 'register');
    }
}
