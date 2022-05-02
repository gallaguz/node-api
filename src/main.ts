import { App } from './app';
import { LoggerService } from './logger';

const bootstrap = async () => {
  const app = new App(new LoggerService());
  await app.init();
};

bootstrap();
