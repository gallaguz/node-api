import { Container } from 'inversify';

import { APP_KEYS } from '@app/app-keys';
import { ILogger } from '@app/logger/logger.interface';
import { PASSWORD_CONTAINER } from '@app/password/password.container';
import { ROOT_CONTAINER } from '@app/root.container';
import { TOKEN_CONTAINER } from '@app/token/token.container';
import { USER_CONTAINER } from '@app/user/user.container';

const appContainer = new Container();
appContainer.load(ROOT_CONTAINER);
appContainer.load(USER_CONTAINER);
appContainer.load(TOKEN_CONTAINER);
appContainer.load(PASSWORD_CONTAINER);

const loggerService = appContainer.get<ILogger>(APP_KEYS.LoggerService);

export { appContainer, loggerService };
