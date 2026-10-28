require('dotenv').config();

const app = require('./app');
const prisma = require('./database');

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await prisma.$connect();
    await prisma.$queryRaw`SELECT 1`;

    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  } catch (error) {
    console.error('Falha ao conectar ao banco de dados:', error);
    await prisma.$disconnect();
    process.exitCode = 1;
  }
};

startServer();
