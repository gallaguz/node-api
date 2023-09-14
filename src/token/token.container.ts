import { ContainerModule, interfaces } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { TokenRepository } from '@app/token/token.repository';
import { ITokenRepository } from '@app/token/token.repository.interface';
import { TokenService } from '@app/token/token.service';
import { ITokenService } from '@app/token/token.service.interface';

const TOKEN_CONTAINER = new ContainerModule((bind: interfaces.Bind) => {
    bind<ITokenService>(APP_KEYS.TokenService).to(TokenService);
    bind<ITokenRepository>(APP_KEYS.TokenRepository).to(TokenRepository);
});

export { TOKEN_CONTAINER };
