import * as process from 'process';

import { loggerService } from '@app/bootstrap';
import { LOG_LEVELS, LOG_LEVELS_MAP } from '@app/logger/config';

export enum TRACE_TYPE {
    ASYNC = 'ASYNC',
    SYNC = 'SYNC',
}

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
    loggerService.trace(
        `${end.getTime() - start.getTime()} - ms ${label.constructorName}-${
            label.methodName
        }`,
    );
};

export function Trace(
    metricType: TRACE_TYPE,
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

        if (metricType === TRACE_TYPE.SYNC) {
            descriptor.value = function (...args: any[]): void {
                const startTime: Date = new Date();

                let res;

                try {
                    if (originalMethod) {
                        res = originalMethod.apply(this, args);
                    }
                } finally {
                    messageConstructor(startTime, new Date(), label);
                }

                return res;
            };
        } else {
            descriptor.value = async function (...args: any[]): Promise<any> {
                const startTime: Date = new Date();

                let res;

                try {
                    if (originalMethod) {
                        res = await originalMethod.apply(this, args);
                    }
                } finally {
                    messageConstructor(startTime, new Date(), label);
                }

                return res;
            };
        }
    };
}
