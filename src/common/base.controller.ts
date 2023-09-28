import 'reflect-metadata';
import { Response, Router } from 'express';
import { injectable } from 'inversify';

import {
    ExpressReturnType,
    IBaseController,
    IRouteInterface,
} from '@app/common/base.controller.interface';
import {
    CLIENT_ERROR_CODES,
    SUCCESS_CODES,
    TStatusCodes,
} from '@app/constants/status.codes';
import { ILogger } from '@app/logger/logger.interface';

@injectable()
export abstract class BaseController implements IBaseController {
    private readonly _router: Router;

    constructor(public loggerService: ILogger) {
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
        return this.responseWithPayload<TMessage>(
            res,
            SUCCESS_CODES.OK,
            message,
        );
    }

    public created<TMessage>(
        res: Response,
        message: TMessage,
    ): ExpressReturnType {
        return this.responseWithPayload<TMessage>(
            res,
            SUCCESS_CODES.CREATED,
            message,
        );
    }

    public async conflict<TMessage>(
        req: Request,
        res: Response,
        message: TMessage,
    ): Promise<ExpressReturnType> {
        return this.responseWithPayload<TMessage>(
            res,
            CLIENT_ERROR_CODES.CONFLICT,
            message,
        );
    }

    protected bindRoutes(routes: IRouteInterface[]): void {
        this.loggerService.info(`[ Routes Binding ] ${this.constructor.name}:`);

        for (const route of routes) {
            this.loggerService.info(
                ` - [ ${route.method.toUpperCase()} ] ${route.path}`,
            );

            const middleware = route.middlewares?.map((m) => m.execute.bind(m));
            const handler = route.handler.bind(this);
            const pipeline = middleware ? [...middleware, handler] : handler;

            this.router[route.method](route.path, pipeline);
        }
    }
}
