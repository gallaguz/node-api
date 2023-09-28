// import 'reflect-metadata';
// import { User } from '@prisma/client';
// import { Container } from 'inversify';
//
// import { APP_KEYS } from '@app/app-keys';
// import { IConfigService } from '@app/config';
// import { APP_ENV } from '@app/constants';
// import {
//     IUserEntity,
//     IUserRepository,
//     IUserService,
//     UserService,
// } from '@app/user';
//
// const ConfigServiceMock: IConfigService = {
//     appEnv: APP_ENV.TESTING,
//     get: jest.fn(),
// };
//
// const UsersRepositoryMock: IUserRepository = {
//     getUserByEmail: jest.fn(),
//     getUserByUserId: jest.fn(),
//     create: jest.fn(),
// };
//
// const container = new Container();
// let configService: IConfigService;
// let usersRepository: IUserRepository;
// let usersService: IUserService;
//
// beforeAll(() => {
//     container.bind<IUserService>(APP_KEYS.UserService).to(UserService);
//     container
//         .bind<IConfigService>(APP_KEYS.ConfigService)
//         .toConstantValue(ConfigServiceMock);
//     container
//         .bind<IUserRepository>(APP_KEYS.UserRepository)
//         .toConstantValue(UsersRepositoryMock);
//
//     usersService = container.get<IUserService>(APP_KEYS.UserService);
//     configService = container.get<IConfigService>(APP_KEYS.ConfigService);
//     usersRepository = container.get<IUserRepository>(APP_KEYS.UserRepository);
// });
//
// let createdUser: User | null;
//
// describe('User Service', () => {
//     it('CreateUser', async () => {
//         configService.get = jest.fn().mockReturnValueOnce(10);
//         usersRepository.create = jest.fn().mockImplementationOnce(
//             (user: IUserEntity): IUserEntity => ({
//                 name: user.name,
//                 email: user.email,
//                 password: user.password,
//             }),
//         );
//
//         createdUser = await usersService.registration({
//             email: 'email@email.com',
//             name: 'name',
//             password: 'password',
//         });
//
//         expect(createdUser?.id).toEqual(1);
//         expect(createdUser?.password).not.toEqual('password');
//     });
//
//     it('ValidateUser - success', async () => {
//         usersRepository.getUserWithPayload = jest
//             .fn()
//             .mockReturnValueOnce(createdUser);
//         const res = await usersService.validateUser({
//             email: 'email@email.com',
//             password: 'password',
//         });
//         expect(res).toBeTruthy();
//     });
//
//     it('ValidateUser - wrong password', async () => {
//         usersRepository.getUserWithPayload = jest
//             .fn()
//             .mockReturnValueOnce(createdUser);
//         const res = await usersService.validateUser({
//             email: 'email@email.com',
//             password: 'password123',
//         });
//         expect(res).toBeFalsy();
//     });
//
//     it('ValidateUser - wrong user', async () => {
//         usersRepository.getUserWithPayload = jest
//             .fn()
//             .mockReturnValueOnce(null);
//         const res = await usersService.validateUser({
//             email: 'email@email.com',
//             password: 'password',
//         });
//         expect(res).toBeFalsy();
//     });
// });
