import {
    CLIENT_ERROR_CODES,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';
import { HttpError, THttpErrorInput } from '@app/errors/http.error';

export class NotFoundError extends HttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.NOT_FOUND,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.NOT_FOUND],
            context: input?.context,
            originalError: input?.originalError,
        });
    }
}
