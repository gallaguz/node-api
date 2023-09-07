import { IHttpErrorInterface } from '@app/errors';

export class HttpError extends Error implements IHttpErrorInterface {
    statusCode: number;
    message: string;
    context?: string;

    constructor(statusCode: number, message: string, context?: string) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.context = context;
    }
}
