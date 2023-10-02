import * as winston from 'winston';

export const LOG_LEVELS = {
    CRITICAL: 0,
    ERROR: 1,
    WARNING: 2,
    INFO: 3,
    PROMPT: 4,
    DATA: 5,
    DEBUG: 6,
    TRACE: 7,
};

export const LOG_LEVELS_MAP = {
    [LOG_LEVELS.CRITICAL]: 'CRITICAL',
    [LOG_LEVELS.ERROR]: 'ERROR',
    [LOG_LEVELS.WARNING]: 'WARNING',
    [LOG_LEVELS.INFO]: 'INFO',
    [LOG_LEVELS.PROMPT]: 'PROMPT',
    [LOG_LEVELS.DATA]: 'DATA',
    [LOG_LEVELS.DEBUG]: 'DEBUG',
    [LOG_LEVELS.TRACE]: 'TRACE',
};

/**
 * Font styles: bold, dim, italic, underline, inverse, hidden, strikethrough.
 *
 * Font foreground colors: black, red, green, yellow, blue, magenta, cyan, white, gray, grey.
 *
 * Background colors: blackBG, redBG, greenBG, yellowBG, blueBG magentaBG, cyanBG, whiteBG
 */
export const LOG_COLOURS: winston.config.AbstractConfigSetColors = {
    [LOG_LEVELS_MAP[LOG_LEVELS.CRITICAL]]: 'bold red blackBG',
    [LOG_LEVELS_MAP[LOG_LEVELS.ERROR]]: 'red blackBG',
    [LOG_LEVELS_MAP[LOG_LEVELS.WARNING]]: 'underline yellow',
    [LOG_LEVELS_MAP[LOG_LEVELS.INFO]]: 'white',
    [LOG_LEVELS_MAP[LOG_LEVELS.PROMPT]]: 'cyan',
    [LOG_LEVELS_MAP[LOG_LEVELS.DATA]]: 'magenta',
    [LOG_LEVELS_MAP[LOG_LEVELS.DEBUG]]: 'green',
    [LOG_LEVELS_MAP[LOG_LEVELS.TRACE]]: 'blue',
};
