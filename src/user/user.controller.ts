import { BaseController } from '../common';
import { LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';

export class UserController extends BaseController {
    constructor(logger: LoggerService) {
        super(logger);
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
