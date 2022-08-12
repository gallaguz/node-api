import { HttpErrorInterface } from '@app/errors';

export class HttpError extends Error implements HttpErrorInterface {
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
