import { injectable } from 'inversify';

import { ILogger } from '@app/common';
import {
    CLIENT_ERROR,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';
import { HttpError } from '@app/errors';

@injectable()
export class BaseService {
    constructor(public logger: ILogger) {}

    public serviceError(props: {
        originalError?: any;
        message?: string;
        statusCode?: number;
        context?: string;
    }): Error {
        if (props?.originalError instanceof Error) {
            this.logger.error(props.originalError.message);
        }
        return new HttpError(
            props.statusCode || CLIENT_ERROR.BAD_REQUEST,
            props.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR.BAD_REQUEST],
            props.context || this.constructor.name,
        );
    }
}
