import { BaseController } from '../common';
import { ILogger, LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';

@injectable()
export class UserController extends BaseController {
    constructor(@inject(TYPES.ILogger) private loggerService: ILogger) {
        super(loggerService);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            { path: '/registration', func: this.registration, method: 'post' },
        ]);
    }

    login(req: Request, res: Response, next: NextFunction) {
        // this.ok(res, 'login');
        next(new HttpError(401, 'Auth error', 'login'));
    }

    registration(req: Request, res: Response, next: NextFunction) {
        this.ok(res, 'registration');
    }
}
