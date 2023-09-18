import {
    CLIENT_ERROR_CODES,
    STATUS_CODES_MESSAGES_MAP,
} from '@app/constants/status.codes';

export type THttpErrorInput = {
    statusCode?: number;
    message?: string;
    context?: string;
    originalError?: unknown;
};
export class HttpError extends Error {
    statusCode: number;
    message: string;
    originalError?: unknown;
    context?: string;

    constructor(input?: THttpErrorInput) {
        super(
            input?.message ||
                STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST],
        );
        this.statusCode = input?.statusCode || CLIENT_ERROR_CODES.BAD_REQUEST;
        this.message =
            input?.message ||
            STATUS_CODES_MESSAGES_MAP[CLIENT_ERROR_CODES.BAD_REQUEST];
        this.context = input?.context;
        this.originalError = input?.originalError;
    }
}
