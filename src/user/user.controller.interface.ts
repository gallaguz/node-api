import { NextFunction, Request, Response } from 'express';

import { IBaseController } from '@app/common/base.controller.interface';
import { UserRegisterDto } from '@app/user/user.register.dto';

export interface IUserController extends IBaseController {
    index(
        req: Request<{}, {}, UserRegisterDto>,
        res: Response,
        next: NextFunction,
    ): Promise<void>;
    // login(req: Request, res: Response, next: NextFunction): Promise<void>;
    // registration(
    //     req: Request,
    //     res: Response,
    //     next: NextFunction,
    // ): Promise<void>;
    // info(req: Request, res: Response, next: NextFunction): Promise<void>;
    // refresh(req: Request, res: Response, next: NextFunction): Promise<void>;
}
