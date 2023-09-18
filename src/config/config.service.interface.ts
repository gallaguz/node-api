import { APP_ENV, ENV_VARS } from '@app/constants/environment';

export interface IConfigService {
    appEnv: APP_ENV;
    get(key: ENV_VARS): string;
}
