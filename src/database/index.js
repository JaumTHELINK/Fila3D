const DatabaseConnection = require('../infrastructure/database/DatabaseConnection');

// Mantém a API anterior (require('./database') devolve o PrismaClient), agora
// obtido pelo Singleton DatabaseConnection.
module.exports = DatabaseConnection.getInstance().getClient();
