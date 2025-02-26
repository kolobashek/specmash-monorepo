// jest.config.js
// import { pathsToModuleNameMapper } from 'ts-jest/utils'
// import { compilerOptions } from './tsconfig.json'
module.exports = {
	// настройки Jest
	setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
	// moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
	preset: 'ts-jest',
	testEnvironment: 'node',
}
