import express, { Express } from 'express';
import { userRouter } from './router';
import { Server } from 'http';
import { LoggerService } from './logger';

export class App {
  app: Express;
  server: Server;
  port: number;
  logger: LoggerService;

  constructor(logger: LoggerService) {
    this.app = express();
    this.port = 8000;
    this.logger = logger;
  }

  useRoutes() {
    this.app.use('/users', userRouter);
  }

  public async init() {
    this.useRoutes();
    this.server = this.app.listen(this.port);
    this.logger.log(`Started at http://localhost:${this.port}`);
  }
}
