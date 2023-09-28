import { ContainerModule, interfaces } from 'inversify';

import { APP_KEYS } from '@app/app-keys';

import { PasswordService } from './password.service';
import { IPasswordService } from './password.service.interface';

const PASSWORD_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    bind<IPasswordService>(APP_KEYS.PasswordService).to(PasswordService);
});

export { PASSWORD_CONTAINER };
