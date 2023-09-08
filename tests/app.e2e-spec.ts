import request from 'supertest';

import { App } from '@app/app';
import { boot } from '@app/main';

let application: App;

beforeAll(async () => {
    const { app } = await boot;
    application = app;
});

describe('Users e2e', () => {
    it('Register - error (422 Unprocessable Entity)', async () => {
        const res = await request(application.app)
            .post('/users/register')
            .send({ email: 'email@email.com', password: 'password' });
        expect(res.statusCode).toBe(422);
    });

    it('Login - success)', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send({ email: 'email@email.com', password: 'password' });
        // console.log('------------------', res.cookies);
        expect(res.body.accessToken).not.toBeUndefined();
    });

    it('Login - error)', async () => {
        const res = await request(application.app)
            .post('/users/login')
            .send({ email: 'email@email.com', password: 'wrongPassword' });
        expect(res.statusCode).toBe(401);
    });

    it('Info - success)', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: 'test@test.com', password: 'test' });
        const res = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer ${login.body.accessToken}`);
        expect(res.body.user.email).toBe('test@test.com');
    });

    it('Info - error)', async () => {
        const login = await request(application.app)
            .post('/users/login')
            .send({ email: 'email@email.com', password: 'password' });
        const res = await request(application.app)
            .get('/users/info')
            .set('Authorization', `Bearer WrongToken`);
        expect(res.statusCode).toBe(500);
    });
});

afterAll(() => {
    application.close();
});
