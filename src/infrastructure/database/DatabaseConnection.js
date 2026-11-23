// Padrão GoF: Singleton. Resolve: garante UMA única conexão (PrismaClient) com o
// banco em toda a aplicação, evitando abrir várias conexões/pools por engano.
// Ponto de acesso global e controlado: DatabaseConnection.getInstance().
// GRASP: Pure Fabrication (classe técnica, fora do domínio, que cuida só da
// conexão) e Protected Variations (trocar o adapter/banco muda só esta classe).
const { PrismaBetterSqlite3 } = require('@prisma/adapter-better-sqlite3');
const { PrismaClient } = require('@prisma/client');

// Token que só este arquivo conhece: simula o construtor privado do diagrama
// (JavaScript não tem "private constructor").
const TOKEN_CONSTRUCAO = Symbol('DatabaseConnection');

class DatabaseConnection {
  static #instance = null;
  #client;

  constructor(token) {
    if (token !== TOKEN_CONSTRUCAO) {
      throw new Error(
        'DatabaseConnection é um Singleton: use DatabaseConnection.getInstance().',
      );
    }

    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) {
      throw new Error('A variável DATABASE_URL não foi definida.');
    }

    const adapter = new PrismaBetterSqlite3({ url: connectionString });
    this.#client = new PrismaClient({ adapter });
  }

  static getInstance() {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection(TOKEN_CONSTRUCAO);
    }
    return DatabaseConnection.#instance;
  }

  getClient() {
    return this.#client;
  }
}

module.exports = DatabaseConnection;
