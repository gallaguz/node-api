import express, { Request, Response, NextFunction } from 'express';

import { userRouter } from './router';

const port = 8000;
const app = express();

app.use((request: Request, response: Response, next: NextFunction) => {
  console.log('Time', Date.now());
  next();
});

app.get('/hello', (request: Request, response: Response) => {
  response.send('Hello');
  response.end();
});

app.get('/error', (request: Request, response: Response) => {
  throw new Error('Error message');
});

app.use('/users', userRouter);

app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    console.log(err.message);
    response.status(500).send(err.message);
    next();
  }
);

app.listen(port, () => {
  console.log(`Started at http://localhost:${port}`);
});
