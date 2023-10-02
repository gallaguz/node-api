import * as process from 'process';

import { LOG_LEVELS, LOG_LEVELS_MAP } from '../logger';

type TLabel = {
    constructorName: string;
    methodName: string;
    message?: string;
};

const labelConstructor = (
    constructorName: string,
    propertyKey: string,
    message?: string,
): TLabel => {
    return {
        constructorName,
        methodName: propertyKey.toString(),
        message,
    };
};

const messageConstructor = (start: Date, end: Date, label: TLabel): void => {
    console.trace(
        `${end.getTime() - start.getTime()} - ms ${label.constructorName}-${
            label.methodName
        }`,
    );
};

export function Trace(
    message?: string,
): (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
) => void {
    return function (
        target: Object,
        propertyKey: string | symbol,
        descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
    ): void {
        const originalMethod = descriptor.value;

        if (process.env.LOG_LEVEL !== LOG_LEVELS_MAP[LOG_LEVELS.TRACE]) {
            descriptor.value = function (...args: any[]): void {
                return originalMethod?.apply(this, args);
            };
        }

        const label: TLabel = labelConstructor(
            target.constructor.name,
            propertyKey.toString(),
            message,
        );

        descriptor.value = function (...args: any[]): Promise<any> {
            const startTime: Date = new Date();

            let value;

            try {
                if (originalMethod) {
                    value = originalMethod.apply(this, args);
                    if (value instanceof Promise) {
                        return Promise.resolve(value);
                    }
                }
            } finally {
                if (
                    process.env.LOG_LEVEL === LOG_LEVELS_MAP[LOG_LEVELS.TRACE]
                ) {
                    messageConstructor(startTime, new Date(), label);
                }
            }

            return value;
        };
    };
}
