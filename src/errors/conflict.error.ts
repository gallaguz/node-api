import {
    CLIENT_ERROR_CODES,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';
import { HttpError, THttpErrorInput } from '@app/errors/http.error';

export class ConflictError extends HttpError {
    constructor(input?: THttpErrorInput) {
        super({
            statusCode: input?.statusCode || CLIENT_ERROR_CODES.CONFLICT,
            message:
                input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.CONFLICT],
            context: input?.context,
            originalError: input?.originalError,
        });
    }
}
