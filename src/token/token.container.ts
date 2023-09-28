import { ContainerModule, interfaces } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import {
    ITokenService,
    TokenService,
    ITokenRepository,
    TokenRepository,
} from '@app/token';

const TOKEN_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    bind<ITokenService>(APP_KEYS.TokenService).to(TokenService);
    bind<ITokenRepository>(APP_KEYS.TokenRepository).to(TokenRepository);
});

export { TOKEN_CONTAINER };
