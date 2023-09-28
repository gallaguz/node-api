import { CLIENT_ERROR_CODES, STATUS_CODES_MESSAGES_MAP } from '@app/constants';

import { HttpError, THttpErrorInput } from './http.error';

export class UnauthorizedError extends HttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.UNAUTHORIZED,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.UNAUTHORIZED],
            context: input?.context,
            originalError: input?.originalError,
        });
    }
}
