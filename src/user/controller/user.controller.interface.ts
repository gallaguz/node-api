import { NextFunction, Request, Response } from 'express';

import { IBaseController } from '@app/common';

export interface IUserController extends IBaseController {
    login: (req: Request, res: Response, next: NextFunction) => void;
    registration: (req: Request, res: Response, next: NextFunction) => void;
    // info: (req: Request, res: Response, next: NextFunction) => void;
}
