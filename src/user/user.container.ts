import { ContainerModule, interfaces } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { UserController } from '@app/user/user.controller';
import { IUserController } from '@app/user/user.controller.interface';
import { UserRepository } from '@app/user/user.repository';
import { IUserRepository } from '@app/user/user.repository.interface';
import { UserService } from '@app/user/user.service';
import { IUserService } from '@app/user/user.service.interface';

const USER_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    bind<IUserController>(APP_KEYS.UserController).to(UserController);
    bind<IUserService>(APP_KEYS.UserService).to(UserService);
    bind<IUserRepository>(APP_KEYS.UserRepository)
        .to(UserRepository)
        .inSingletonScope();
});

export { USER_CONTAINER };
