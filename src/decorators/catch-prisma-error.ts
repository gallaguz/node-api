import process from 'process';

import {
    PrismaClientInitializationError,
    PrismaClientKnownRequestError,
    PrismaClientRustPanicError,
    PrismaClientUnknownRequestError,
    PrismaClientValidationError,
} from '@prisma/client/runtime/library';

import { BadRequestError } from '@app/errors/bad-request.error';
import { loggerService } from '@app/main';

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

export function CatchPrismaError(): (
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

        descriptor.value = function (...args: any[]): Promise<any> {
            let value;

            try {
                if (originalMethod) {
                    value = originalMethod.apply(this, args);
                    if (value instanceof Promise) {
                        return Promise.resolve(value);
                    }
                }
            } catch (error) {
                if (
                    error instanceof PrismaClientKnownRequestError ||
                    error instanceof PrismaClientUnknownRequestError ||
                    error instanceof PrismaClientRustPanicError ||
                    error instanceof PrismaClientInitializationError ||
                    error instanceof PrismaClientValidationError
                ) {
                    throw new BadRequestError({
                        context: `${
                            target.constructor.name
                        }:${propertyKey.toString()}`,
                        originalError: error,
                    });
                } else {
                    throw error;
                }
            }

            return value;
        };
    };
}