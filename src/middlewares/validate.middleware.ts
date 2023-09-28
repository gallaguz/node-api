import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { NextFunction, Request, Response } from 'express';

import { ILogger } from '@app/logger';

import { IMiddleware } from './middleware.interface';

export class ValidateMiddleware implements IMiddleware {
    constructor(
        private loggerService: ILogger,
        private classToValidate: ClassConstructor<object>,
    ) {}

    async execute(
        { body }: Request,
        res: Response,
        next: NextFunction,
    ): Promise<void> {
        const instance = plainToInstance(this.classToValidate, body);

        validate(instance).then((errors) => {
            if (errors.length > 0) {
                this.loggerService.debug(errors.toString());
                res.status(422).send(errors);
            } else {
                next();
            }
        });
    }
}
