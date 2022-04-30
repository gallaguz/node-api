import express from 'express';

const port = 8000;
const app = express();

app.all('/hello', (req, res, next) => {
    console.log('All');
    next();
});

app.route('/hello').get((req, res) => {
    // res.set('Content-Type', 'text/plain');
    // res.append('Warning', 'code');
    res.cookie('token', 'lol', {
        domain: 'localhost',
        path: '/local',
        secure: true,
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 7,
        expires: 60 * 60 * 24 * 7,
    });
    // res.clearCookie('token');
    res.type('application/json');
    res.status(201).send({ success: true });
    // res.download('/test.pdf', 'new_name.pdf');
    // res.redirect(301, 'https://redirect.com');
    // res.status(201).join({ success: true });
    res.end();
});

app.listen(port, () => {
    console.log(`Started at http://localhost:${port}`);
});
