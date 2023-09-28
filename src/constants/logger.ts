import * as winston from 'winston';

export const LOG_LEVELS = {
    CRITICAL: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    DEBUG: 4,
    TRACE: 5,
};

export const LOG_LEVELS_MAP = {
    [LOG_LEVELS.CRITICAL]: 'CRITICAL',
    [LOG_LEVELS.ERROR]: 'ERROR',
    [LOG_LEVELS.WARNING]: 'WARNING',
    [LOG_LEVELS.INFO]: 'INFO',
    [LOG_LEVELS.DEBUG]: 'DEBUG',
    [LOG_LEVELS.TRACE]: 'TRACE',
};

export const LOG_COLOURS: winston.config.AbstractConfigSetColors = {
    [LOG_LEVELS_MAP[LOG_LEVELS.CRITICAL]]: 'red',
    [LOG_LEVELS_MAP[LOG_LEVELS.ERROR]]: 'red',
    [LOG_LEVELS_MAP[LOG_LEVELS.WARNING]]: 'yellow',
    [LOG_LEVELS_MAP[LOG_LEVELS.INFO]]: 'white',
    [LOG_LEVELS_MAP[LOG_LEVELS.DEBUG]]: 'green',
    [LOG_LEVELS_MAP[LOG_LEVELS.TRACE]]: 'blue',
};
