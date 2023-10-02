export interface ILogger {
    critical(message: string | number | object): void;
    error(message: string | number | object): void;
    warning(message: string | number | object): void;
    info(message: string | number | object): void;
    data(message: string | number | object): void;
    debug(message: string | number | object): void;
    trace(message: string | number | object): void;
    morgan(message: string | number | object): void;
}
