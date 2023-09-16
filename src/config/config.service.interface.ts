export enum APP_ENV {
    LOCAL = 'local',
    DEVELOPMENT = 'development',
    STAGING = 'staging',
    PRODUCTION = 'production',
    TESTING = 'testing',
}

export interface IConfigService {
    appEnv: APP_ENV;
    get(key: string): string;
}
