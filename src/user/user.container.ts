import { ContainerModule, interfaces } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import {
    IUserController,
    UserController,
    IUserService,
    UserService,
    IUserRepository,
    UserRepository,
} from '@app/user';

const USER_CONTAINER: ContainerModule = new ContainerModule(
    (bind: interfaces.Bind): void => {
        bind<IUserController>(APP_KEYS.UserController).to(UserController);
        bind<IUserService>(APP_KEYS.UserService).to(UserService);
        bind<IUserRepository>(APP_KEYS.UserRepository)
            .to(UserRepository)
            .inSingletonScope();
    },
);

export { USER_CONTAINER };
