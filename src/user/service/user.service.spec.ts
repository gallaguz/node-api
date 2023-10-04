import 'reflect-metadata';
import { User } from '@prisma/client';
import { Container } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { IConfigService } from '@app/config';
import { APP_ENV } from '@app/constants';
import { ILogger } from '@app/logger';
import { IPasswordService } from '@app/password';
import { ITokenService } from '@app/token';
import {
    IUserEntity,
    IUserRepository,
    IUserService,
    UserService,
} from '@app/user';

const ConfigServiceMock: IConfigService = {
    appEnv: APP_ENV.TESTING,
    get: jest.fn(),
};

const LoggerServiceMock: ILogger = {
    critical: jest.fn(),
    data: jest.fn(),
    morgan: jest.fn(),
    trace: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
};
const TokenServiceMock: ITokenService = {
    generateRefreshToken: jest.fn(),
    generateAccessToken: jest.fn(),
    validateAccessToken: jest.fn(),
    validateRefreshToken: jest.fn(),
    saveRefreshToken: jest.fn(),
    findByUserId: jest.fn(),
    refresh: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
    getUserByEmail: jest.fn(),
    getUserByUserId: jest.fn(),
    create: jest.fn(),
};

const PasswordServiceMock: IPasswordService = {
    hash: jest.fn(),
    compare: jest.fn(),
};

const appContainer: Container = new Container();
let loggerService: ILogger;
let configService: IConfigService;
let usersRepository: IUserRepository;
let usersService: IUserService;
let passwordService: IPasswordService;

beforeAll(() => {
    appContainer.bind<IUserService>(APP_KEYS.UserService).to(UserService);
    appContainer
        .bind<IConfigService>(APP_KEYS.ConfigService)
        .toConstantValue(ConfigServiceMock);
    appContainer
        .bind<ILogger>(APP_KEYS.LoggerService)
        .toConstantValue(LoggerServiceMock);
    appContainer
        .bind<IUserRepository>(APP_KEYS.UserRepository)
        .toConstantValue(UsersRepositoryMock);
    appContainer
        .bind<IPasswordService>(APP_KEYS.PasswordService)
        .toConstantValue(PasswordServiceMock);
    appContainer
        .bind<ITokenService>(APP_KEYS.TokenService)
        .toConstantValue(TokenServiceMock);

    configService = appContainer.get<IConfigService>(APP_KEYS.ConfigService);
    usersRepository = appContainer.get<IUserRepository>(
        APP_KEYS.UserRepository,
    );
    passwordService = appContainer.get<IPasswordService>(
        APP_KEYS.PasswordService,
    );
    usersService = appContainer.get<IUserService>(APP_KEYS.UserService);
});

let createdUser: User | null;

describe('#UserService', () => {
    describe('.registration', () => {
        const mockUser = {
            id: 'someId',
            name: 'someName',
            email: 'some@mail.com',
            password: 'somePassword',
        };

        beforeAll(() => {
            ConfigServiceMock.get = jest
                .fn()
                .mockReturnValueOnce((key: string) => '10');

            PasswordServiceMock.hash = jest
                .fn()
                .mockImplementationOnce(
                    async (password: string): Promise<string> =>
                        'somePasswordHash',
                );

            UsersRepositoryMock.getUserByEmail = jest
                .fn()
                .mockImplementationOnce(
                    async (email: string): Promise<User | null> => null,
                );

            usersRepository.create = jest.fn().mockImplementationOnce(
                async (user: IUserEntity): Promise<User> => ({
                    id: mockUser.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                    created_at: new Date(),
                    updated_at: new Date(),
                }),
            );
        });

        it('should register a new user', async (): Promise<void> => {
            createdUser = await usersService.registration({
                name: mockUser.name,
                email: mockUser.email,
                password: mockUser.password,
            });

            expect(createdUser?.id).toEqual(mockUser.id);
            expect(createdUser?.email).toEqual(mockUser.email);
            expect(createdUser?.password).not.toEqual(mockUser.password);
        });
    });

    // it('ValidateUser - success', async () => {
    //     usersRepository.getUserWithPayload = jest
    //         .fn()
    //         .mockReturnValueOnce(createdUser);
    //     const res = await usersService.validateUser({
    //         email: 'email@email.com',
    //         password: 'password',
    //     });
    //     expect(res).toBeTruthy();
    // });
    //
    // it('ValidateUser - wrong password', async () => {
    //     usersRepository.getUserWithPayload = jest
    //         .fn()
    //         .mockReturnValueOnce(createdUser);
    //     const res = await usersService.validateUser({
    //         email: 'email@email.com',
    //         password: 'password123',
    //     });
    //     expect(res).toBeFalsy();
    // });
    //
    // it('ValidateUser - wrong user', async () => {
    //     usersRepository.getUserWithPayload = jest
    //         .fn()
    //         .mockReturnValueOnce(null);
    //     const res = await usersService.validateUser({
    //         email: 'email@email.com',
    //         password: 'password',
    //     });
    //     expect(res).toBeFalsy();
    // });
});
