import { BaseController } from '../common';
import { ILogger, LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';

@injectable()
export class UserController extends BaseController implements IUserController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            { path: '/register', func: this.register, method: 'post' },
        ]);
    }

    login(req: Request, res: Response, next: NextFunction): void {
        next(new HttpError(401, 'Auth error', 'login'));
    }

    register(req: Request, res: Response, next: NextFunction): void {
        this.ok(res, 'register');
    }
}
