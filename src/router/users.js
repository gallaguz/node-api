import express from 'express';

const userRouter = express.Router();

userRouter.post('/login', (req, res) => {
    res.send('login');
});

userRouter.post('/registration', (req, res) => {
    res.send('registration');
});

export { userRouter };
