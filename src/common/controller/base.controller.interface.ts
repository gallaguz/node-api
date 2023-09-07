import { Response, Router } from 'express';

import { ExpressReturnType } from '@app/common';
import { TStatusCodes } from '@app/constants';

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
