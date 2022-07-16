import { BaseController } from '../common';
import { ILogger, LoggerService } from '../logger';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { IUserController } from './users.controller.interface';
import { UserLoginDto } from './dto/user-login.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { UsersService } from './users.service';
import { ValidateMiddleware } from '../common/validate.middleware';

@injectable()
export class UsersController extends BaseController implements IUserController {
    constructor(
        @inject(TYPES.ILogger) private loggerService: ILogger,
        @inject(TYPES.UsersService) private usersService: UsersService,
    ) {
        super(loggerService);
        this.bindRoutes([
            { path: '/login', func: this.login, method: 'post' },
            {
                path: '/register',
                func: this.register,
                method: 'post',
                middlewares: [new ValidateMiddleware(UserRegisterDto)],
            },
        ]);
    }

    login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction): void {
        console.log(req.body);
        next(new HttpError(401, 'Auth error', 'login'));
    }

    async register(
        { body }: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const result = await this.usersService.createUser(body);
        if (!result) return next(new HttpError(422, 'User exist'));
        this.ok(res, { email: result.email, id: result.id });
    }
}
