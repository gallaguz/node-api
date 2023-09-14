export interface ILogger {
    critical(message: string | number): void;
    error(message: string | number): void;
    warning(message: string | number): void;
    info(message: string | number): void;
    debug(message: string | number): void;
    trace(message: string | number): void;
    morgan(message: string | number): void;
}
