import {
    CLIENT_ERROR_CODES,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';
import { HttpError, THttpErrorInput } from '@app/errors/http.error';

export class BadRequestError extends HttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.BAD_REQUEST,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST],
            context: input?.context,
            originalError: input?.originalError,
        });
    }
}
