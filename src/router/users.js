import express from 'express';

const userRouter = express.Router();

userRouter.use((request, response, next) => {
    console.log('Users handler');
    next();
});

userRouter.post('/login', (req, res) => {
    res.send('login');
});

userRouter.post('/registration', (req, res) => {
    res.send('registration');
});

export { userRouter };
