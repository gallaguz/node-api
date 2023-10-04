import 'reflect-metadata';
import { faker } from '@faker-js/faker';
import { Container } from 'inversify';
import request from 'supertest';

import { App } from '../../src/app';
import { APP_KEYS } from '../../src/app-keys';
import { ILogger } from '../../src/logger';
import { PASSWORD_CONTAINER } from '../../src/password';
import { ROOT_CONTAINER } from '../../src/root.container';
import { TOKEN_CONTAINER } from '../../src/token';
import { USER_CONTAINER } from '../../src/user';

let app: App;
let loggerService: ILogger;

beforeAll(async (): Promise<void> => {
    const appContainer: Container = new Container();
    appContainer.load(ROOT_CONTAINER);
    appContainer.load(USER_CONTAINER);
    appContainer.load(TOKEN_CONTAINER);
    appContainer.load(PASSWORD_CONTAINER);

    app = appContainer.get<App>(APP_KEYS.Application);
    loggerService = appContainer.get<ILogger>(APP_KEYS.LoggerService);

    await app.init();
});

describe('#api', () => {
    describe('.register', () => {
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
    });
    describe('.login', () => {
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
    });
    describe('.logout', () => {
        //
    });
    describe('.refresh', () => {
        //
    });
    describe('.info', () => {
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
});

afterAll(() => {
    void app.close();
});
