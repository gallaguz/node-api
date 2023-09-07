import 'reflect-metadata';

import { Server } from 'http';

import { json } from 'body-parser';
import cookieParser from 'cookie-parser';
import express, { Express } from 'express';
import { inject, injectable } from 'inversify';

import { AuthMiddleware } from '@app/common';
import { IConfigService } from '@app/config';
import { PrismaService } from '@app/database';
import { IExceptionFilter } from '@app/filters';
import { TYPES } from '@app/types';
import { ILogger } from 'src/common/logger';
import { ITokenService } from 'src/token';
import { IUserController } from 'src/user';

@injectable()
export class App {
    app: Express;
    server: Server;
    port: number;

    constructor(
        @inject(TYPES.ILogger) private logger: ILogger,
        @inject(TYPES.UserController) private userController: IUserController,
        @inject(TYPES.ExceptionFilter)
        private exceptionFilter: IExceptionFilter,
        @inject(TYPES.ConfigService) private configService: IConfigService,
        @inject(TYPES.PrismaService) private prismaService: PrismaService,
        @inject(TYPES.TokenService) private tokenService: ITokenService,
    ) {
        this.app = express();
        this.port = Number(this.configService.get('PORT'));
    }

    useMiddleware(): void {
        this.app.use(json());
        const authMiddleware = new AuthMiddleware(
            this.configService,
            this.logger,
            this.tokenService,
        );
        this.app.use(authMiddleware.execute.bind(authMiddleware));
    }

    useRoutes(): void {
        this.app.use('/users', this.userController.router);
    }

    useCookie(): void {
        this.app.use(cookieParser());
    }

    useExceptionFilters(): void {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

    public async init(): Promise<void> {
        this.useMiddleware();
        this.useCookie();
        this.useRoutes();
        this.useExceptionFilters();
        await this.prismaService.connect();
        this.server = this.app.listen(this.port);
        this.logger.log(
            `[${this.constructor.name}] Started at http://localhost:${this.port}`,
        );
    }

    public close(): void {
        this.server.close();
    }
}
