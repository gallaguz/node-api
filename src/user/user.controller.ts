import { BaseController } from '../common';
import { LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';

export class UserController extends BaseController {
  constructor(logger: LoggerService) {
    super(logger);
    this.bindRoutes([
      { path: '/login', func: this.login, method: 'post' },
      { path: '/registration', func: this.registration, method: 'post' },
    ]);
  }

  login(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'login');
  }

  registration(req: Request, res: Response, next: NextFunction) {
    this.ok(res, 'registration');
  }
}
