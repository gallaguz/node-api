import {
    CLIENT_ERROR_CODES,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';

export class ConflictError extends Error {
    statusCode: number;
    message: string;
    context?: string;

    constructor(message?: string, context?: string) {
        super(message);
        this.statusCode = CLIENT_ERROR_CODES.CONFLICT;
        this.message =
            message || STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.CONFLICT];
        this.context = context;
    }
}
