module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/db/seed/**',
  ],
  moduleNameMapper: {
    // Mapear importaciones para permitir rutas absolutas en tests
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  // Configuraciones para manejar los módulos de Next.js
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  setupFiles: ['<rootDir>/src/tests/setup.js'],
};
