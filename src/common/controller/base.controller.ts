import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import { ExpressReturnType, IRouteInterface, ILogger } from '@app/common';
import { SUCCESS, TStatusCodes } from '@app/constants/status.codes';

import { IBaseController } from '.';

@injectable()
export abstract class BaseController implements IBaseController {
    private readonly _router: Router;

    constructor(public logger: ILogger) {
        this._router = Router();
    }

    get router(): Router {
        return this._router;
    }

    public sendJSON<TMessage>(
        res: Response,
        code: TStatusCodes,
        message: TMessage,
    ): ExpressReturnType {
        res.type('application/json');
        return res.status(code).json(message);
    }

    public response(res: Response, code: TStatusCodes): ExpressReturnType {
        return res.sendStatus(code);
    }

    public responseWithPayload<TMessage>(
        res: Response,
        code: TStatusCodes,
        message: TMessage,
    ): ExpressReturnType {
        return this.sendJSON<TMessage>(res, code, message);
    }

    public ok<TMessage>(res: Response, message: TMessage): ExpressReturnType {
        return this.responseWithPayload<TMessage>(res, SUCCESS.OK, message);
    }

    public created<TMessage>(
        res: Response,
        message: TMessage,
    ): ExpressReturnType {
        return this.responseWithPayload<TMessage>(
            res,
            SUCCESS.CREATED,
            message,
        );
    }

    protected bindRoutes(routes: IRouteInterface[]): void {
        this.logger.log(`[Routes Binding] ${this.constructor.name}:`);

        for (const route of routes) {
            this.logger.log(` - [${route.method}] ${route.path}`);

            const middleware = route.middlewares?.map((m) => m.execute.bind(m));
            const handler = route.func.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;

            this.router[route.method](route.path, pipeline);
        }
    }
}
