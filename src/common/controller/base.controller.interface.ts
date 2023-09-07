import { Response, Router } from 'express';

import { ExpressReturnType } from '@app/common';

export interface IBaseController {
    router: Router;
    sendJSON<TMessage>(
        res: Response,
        code: number,
        message: TMessage,
    ): ExpressReturnType;
    ok<TMessage>(res: Response, message: TMessage): ExpressReturnType;
    created<TMessage>(res: Response, message: TMessage): ExpressReturnType;
}
