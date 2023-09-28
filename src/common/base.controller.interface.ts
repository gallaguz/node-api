import { NextFunction, Request, Response, Router } from 'express';

import { TStatusCodes } from '@app/constants/status.codes';
import { IMiddleware } from '@app/middlewares/middleware.interface';

type THttpMethods = 'get' | 'post' | 'delete' | 'patch' | 'put' | 'options';

export interface IRouteInterface {
    path: string;
    handler(req: Request, res: Response, next: NextFunction): void;
    method: keyof Pick<Router, THttpMethods>;
    middlewares?: IMiddleware[];
}

export type ExpressReturnType = Response<any, Record<string, any>>;

export interface IBaseController {
    router: Router;
    sendJSON<TMessage>(
        res: Response,
        code: number,
        message: TMessage,
    ): ExpressReturnType;
    response(res: Response, code: TStatusCodes): ExpressReturnType;
    responseWithPayload<TMessage>(
        res: Response,
        code: TStatusCodes,
        message: TMessage,
    ): ExpressReturnType;
    ok<TMessage>(res: Response, message: TMessage): ExpressReturnType;
    created<TMessage>(res: Response, message: TMessage): ExpressReturnType;
}
