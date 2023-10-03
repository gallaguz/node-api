import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    testEnvironment: 'node',
    preset: 'ts-jest',
    testRegex: '.e2e-spec.ts$',
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
    },
};

export default config;
