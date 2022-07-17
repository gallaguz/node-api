import { IMiddleware } from './middleware.interface';
import { NextFunction, Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { TokenDto } from '../users/dto/token.dto';

export class AuthMiddleware implements IMiddleware {
    constructor(private secret: string) {}

    execute(req: Request, res: Response, next: NextFunction): void {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];

            verify(token, this.secret, (err, decoded) => {
                if (err) next();
                else if (decoded) {
                    const { email } = decoded as TokenDto;
                    if (email) {
                        req.user = email;
                        next();
                    }
                }
            });
        } else next();
    }
}
