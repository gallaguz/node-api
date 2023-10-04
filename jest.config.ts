import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    verbose: true,
    preset: 'ts-jest',
    moduleNameMapper: {
        '^@app/(.*)$': '<rootDir>/src/$1',
    },
};

export default config;
