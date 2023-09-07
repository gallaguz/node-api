import { NextFunction, Request, Response, Router } from 'express';

import { IMiddleware } from '@app/common';

type THttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put' | 'options';

export interface IRouteInterface {
    path: string;
    func: (req: Request, res: Response, next: NextFunction) => void;
    method: keyof Pick<Router, THttpMethods>;
    middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;
