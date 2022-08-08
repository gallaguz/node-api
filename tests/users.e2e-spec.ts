import { boot } from '../src/main';
import { App } from '../src/app';
import request from 'supertest';

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
});

afterAll(() => {
    application.close();
});
