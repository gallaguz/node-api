import express from 'express';

import { userRouter } from './router/index.js';

const port = 8000;
const app = express();

app.get('/hello', (req, res) => {
    res.send('Hello');
    res.end();
});

app.use('/users', userRouter);

app.listen(port, () => {
    console.log(`Started at http://localhost:${port}`);
});
