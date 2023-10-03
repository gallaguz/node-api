import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    // testRegex: '.spec.ts$',
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
    },
};

export default config;
