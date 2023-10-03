import 'reflect-metadata';
import { Server } from 'http';
import process from 'process';

import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import morgan from 'morgan';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config';
import { APP_ENV, ENV_VARS } from '@app/constants';
import { PrismaService } from '@app/database';
import { IExceptionFilter } from '@app/filters';
import { ILogger } from '@app/logger';
import { AuthMiddleware } from '@app/middlewares';
import { ITokenService } from '@app/token';
import { IUserController } from '@app/user';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(APP_KEYS.UserController)
        private userController: IUserController,
        @inject(APP_KEYS.LoggerService) private loggerService: ILogger,
        @inject(APP_KEYS.ConfigService) private configService: IConfigService,
        @inject(APP_KEYS.ExceptionFilter)
        private exceptionFilter: IExceptionFilter,
        @inject(APP_KEYS.PrismaService) private prismaService: PrismaService,
        @inject(APP_KEYS.TokenService) private tokenService: ITokenService,
    ) {
        this.app = express();
        this.port = Number(this.configService.get(ENV_VARS.API_PORT));
    }

    useMiddleware(): void {
        this.app.use(json());

        if (process.env.LOG_LEVEL === 'TRACE') {
            this.app.use(
                morgan('dev', {
                    skip: () => {
                        return (
                            process.env.APP_ENV === APP_ENV.TESTING ||
                            process.env.APP_ENV === APP_ENV.PRODUCTION
                        );
                    },
                }),
            );
        }

        const authMiddleware: AuthMiddleware = new AuthMiddleware(
            this.configService,
            this.loggerService,
            this.tokenService,
        );
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/v1/users', this.userController.router);
    }

    useCookie(): void {
        this.app.use(cookieParser());
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        if (!this.isTerminated()) {
            this.useMiddleware();
            this.useCookie();
            this.useRoutes();
            this.useExceptionFilters();
            await this.prismaService.connect();
            this.server = this.app.listen(this.port);
            this.loggerService.info(
                `[ ${this.constructor.name} ] Listening on port: ${this.port}`,
            );
        } else {
            process.exit(0);
        }
    }

    public isTerminated(): boolean {
        return parseInt(this.configService.get(ENV_VARS.IS_TERMINATED)) === 1;
    }

    public async close(): Promise<void> {
        process.env.IS_TERMINATED = String(1);
        this.loggerService.warning(
            'Shutting down the application gracefully...',
        );
        await this.sleep(30_000);
        this.server.close();
        this.loggerService.warning('Server stopped. Application terminated.');
        process.exit(0);
    }

    public sleep(milliseconds: number): Promise<void> {
        return new Promise((resolve): void => {
            setTimeout((): void => {
                resolve();
            }, milliseconds);
        });
    }
}
