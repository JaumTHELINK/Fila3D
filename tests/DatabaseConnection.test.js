const mockPrismaClient = jest.fn();
const mockAdapterSqlite = jest.fn();

jest.mock('@prisma/client', () => ({ PrismaClient: mockPrismaClient }));
jest.mock('@prisma/adapter-better-sqlite3', () => ({
  PrismaBetterSqlite3: mockAdapterSqlite,
}));

describe('DatabaseConnection (Singleton)', () => {
  const urlOriginal = process.env.DATABASE_URL;
  let DatabaseConnection;

  beforeEach(() => {
    jest.resetModules();
    mockPrismaClient.mockClear();
    mockAdapterSqlite.mockClear();
    process.env.DATABASE_URL = 'file:./teste.db';
    DatabaseConnection = require('../src/infrastructure/database/DatabaseConnection');
  });

  afterAll(() => {
    process.env.DATABASE_URL = urlOriginal;
  });

  it('getInstance deve sempre devolver a mesma instância', () => {
    const a = DatabaseConnection.getInstance();
    const b = DatabaseConnection.getInstance();

    expect(a).toBe(b);
    expect(a).toBeInstanceOf(DatabaseConnection);
  });

  it('deve criar o PrismaClient uma única vez, mesmo com várias chamadas', () => {
    DatabaseConnection.getInstance();
    DatabaseConnection.getInstance().getClient();
    DatabaseConnection.getInstance().getClient();

    expect(mockPrismaClient).toHaveBeenCalledTimes(1);
    expect(mockAdapterSqlite).toHaveBeenCalledWith({
      url: process.env.DATABASE_URL,
    });
  });

  it('getClient deve devolver sempre o mesmo client', () => {
    const client1 = DatabaseConnection.getInstance().getClient();
    const client2 = DatabaseConnection.getInstance().getClient();

    expect(client1).toBeInstanceOf(mockPrismaClient);
    expect(client1).toBe(client2);
  });

  it('não deve permitir instanciar com new fora do getInstance', () => {
    expect(() => new DatabaseConnection()).toThrow('Singleton');
    expect(mockPrismaClient).not.toHaveBeenCalled();
  });

  it('deve lançar erro se DATABASE_URL não estiver definida', () => {
    delete process.env.DATABASE_URL;

    expect(() => DatabaseConnection.getInstance()).toThrow(
      'A variável DATABASE_URL não foi definida.',
    );
  });

  it('src/database deve exportar o client do Singleton', () => {
    const client = require('../src/database');

    expect(client).toBe(DatabaseConnection.getInstance().getClient());
  });
});
