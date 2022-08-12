import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from '@app/common';

export interface IRouteInterface {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<
        Router,
        'get' | 'post' | 'delete' | 'patch' | 'put' | 'options'
    >;
    middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
