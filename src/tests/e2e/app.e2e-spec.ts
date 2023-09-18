import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import request from 'supertest';

import { App } from '@app/app';
import { APP_KEYS } from '@app/app-keys';
import { appContainer } from '@app/bootstrap';

let app: App;

beforeAll(async (): Promise<void> => {
    app = appContainer.get<App>(APP_KEYS.Application);
    await app.init();
});

describe('Users e2e', () => {
    it('Register - error (422 Unprocessable Entity)', async () => {
        const res: request.Response = await request(app.app)
            .post('/v1/users/register')
            .send({ email: 'email@email.com', password: 'password' });
        expect(res.statusCode).toBe(422);
    });

    it('Register - success', async () => {
        const res: request.Response = await request(app.app)
            .post('/v1/users/register')
            .send({
                name: faker.person.firstName(),
                email: faker.internet.email(),
                password: faker.internet.password(),
            });
        expect(res.statusCode).toBe(201);
    });

    it('Login - success', async () => {
        await request(app.app).post('/v1/users/register').send({
            name: 'test',
            email: 'test@test.com',
            password: 'test',
        });
        const res: request.Response = await request(app.app)
            .post('/v1/users/login')
            .send({ email: 'test@test.com', password: 'test' });
        expect(res.body.accessToken).not.toBeUndefined();
    });

    it('Login - error', async () => {
        const res = await request(app.app)
            .post('/v1/users/login')
            .send({ email: 'test@test.com', password: 'wrongPassword' });
        expect(res.statusCode).toBe(401);
    });

    it('Info - success)', async () => {
        const login: request.Response = await request(app.app)
            .post('/v1/users/login')
            .send({ email: 'test@test.com', password: 'test' });
        const res = await request(app.app)
            .get('/v1/users/info')
            .set('Authorization', `Bearer ${login.body.accessToken}`);
        expect(res.body.user.email).toBe('test@test.com');
    });

    it('Info - error)', async () => {
        const res = await request(app.app)
            .get('/v1/users/info')
            .set('Authorization', `Bearer WrongToken`);
        expect(res.statusCode).toBe(400);
    });
});

afterAll(() => {
    app.close();
});
