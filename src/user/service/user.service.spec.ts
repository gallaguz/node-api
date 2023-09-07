// import 'reflect-metadata';
// import { User } from '@prisma/client';
// import { Container } from 'inversify';
//
// import { IConfigService } from '../config/config.service.interface';
// import { TYPES } from '../types';
// import { UserModel } from './user.model';
// import { IUserRepository } from './user.repository.interface';
// import { UserService } from './user.service';
// import { IUserService } from './user.service.interface';
//
// const ConfigServiceMock: IConfigService = {
//     get: jest.fn(),
// };
//
// const UsersRepositoryMock: IUserRepository = {
//     getUserWithPayload: jest.fn(),
//     create: jest.fn(),
// };
//
// const container = new Container();
// let configService: IConfigService;
// let usersRepository: IUserRepository;
// let usersService: IUserService;
//
// beforeAll(() => {
//     container.bind<IUserService>(TYPES.UserService).to(UserService);
//     container
//         .bind<IConfigService>(TYPES.ConfigService)
//         .toConstantValue(ConfigServiceMock);
//     container
//         .bind<IUserRepository>(TYPES.UserRepository)
//         .toConstantValue(UsersRepositoryMock);
//
//     usersService = container.get<IUserService>(TYPES.UserService);
//     configService = container.get<IConfigService>(TYPES.ConfigService);
//     usersRepository = container.get<IUserRepository>(TYPES.UserRepository);
// });
//
// let createdUser: UserModel | null;
//
// describe('User Service', () => {
//     it('CreateUser', async () => {
//         configService.get = jest.fn().mockReturnValueOnce(10);
//         usersRepository.create = jest.fn().mockImplementationOnce(
//             (user: UserModel): UserModel => ({
//                 name: user.name,
//                 email: user.email,
//                 password: user.password,
//                 id: 1,
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
