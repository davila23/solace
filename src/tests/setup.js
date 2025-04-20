// Mock para ENV variables
process.env.API_DEFAULT_PAGE_SIZE = '10';
process.env.API_MAX_PAGE_SIZE = '100';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '24h';

// Mock global utilities
global.btoa = (str) => Buffer.from(str).toString('base64');
global.atob = (str) => Buffer.from(str, 'base64').toString();

// Mock para los módulos que no son necesarios en las pruebas
jest.mock('../db', () => ({
  __esModule: true,
  default: {
    select: jest.fn().mockReturnThis(),
    from: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    limit: jest.fn().mockReturnThis(),
    offset: jest.fn().mockReturnThis(),
    execute: jest.fn().mockResolvedValue([]),
  }
}));
