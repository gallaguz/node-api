import 'reflect-metadata';
import { UserModel } from '@prisma/client';
import { Container } from 'inversify';

import { IConfigService } from '../config/config.service.interface';
import { TYPES } from '../types';
import { User } from './user.entity';
import { IUserRepository } from './user.repository.interface';
import { UserService } from './user.service';
import { IUserService } from './user.service.interface';

const ConfigServiceMock: IConfigService = {
    get: jest.fn(),
};

const UsersRepositoryMock: IUserRepository = {
    find: jest.fn(),
    create: jest.fn(),
};

const container = new Container();
let configService: IConfigService;
let userRepository: IUserRepository;
let userService: IUserService;

beforeAll(() => {
    container.bind<IUserService>(TYPES.UserService).to(UserService);
    container
        .bind<IConfigService>(TYPES.ConfigService)
        .toConstantValue(ConfigServiceMock);
    container
        .bind<IUserRepository>(TYPES.UserRepository)
        .toConstantValue(UsersRepositoryMock);

    userService = container.get<IUserService>(TYPES.UserService);
    configService = container.get<IConfigService>(TYPES.ConfigService);
    userRepository = container.get<IUserRepository>(TYPES.UserRepository);
});

let createdUser: UserModel | null;

describe('User Service', () => {
    it('Create User', async () => {
        configService.get = jest.fn().mockReturnValueOnce(10);

        userRepository.create = jest.fn().mockImplementationOnce(
            (user: User): UserModel => ({
                name: user.name,
                email: user.email,
                password: user.password,
                id: 4,
            }),
        );

        createdUser = await userService.createUser({
            email: 'email@email.com',
            name: 'name',
            password: 'password',
        });

        expect(createdUser?.id).toEqual(4);
        expect(createdUser?.password).not.toEqual('password');
    });

    it('User Exist', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(createdUser);

        const res = await userService.createUser({
            email: 'email88@email.com',
            name: 'name',
            password: 'password',
        });

        expect(res).toBeNull();
    });

    it('Validate User - success', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const res = await userService.validateUser({
            email: 'email@email.com',
            password: 'password',
        });
        expect(res).toBeTruthy();
    });

    it('ValidateUser - wrong password', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const res = await userService.validateUser({
            email: 'email@email.com',
            password: 'wrongPassword',
        });
        expect(res).toBeFalsy();
    });

    it('Validate User - wrong user', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(null);
        const res = await userService.validateUser({
            email: 'email@email.com',
            password: 'password',
        });
        expect(res).toBeFalsy();
    });

    it('Get User Info - success', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(createdUser);
        const res = await userService.getUserInfo('email@email.com');

        expect(res).toBeTruthy();
    });

    it('Get User Info - error', async () => {
        userRepository.find = jest.fn().mockReturnValueOnce(null);
        const res = await userService.getUserInfo('wrong@email.com');
        console.log(res);
        expect(res).toBeFalsy();
    });
});
