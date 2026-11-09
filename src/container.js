const prisma = require('./database');
const ClienteRepositoryPrisma = require('./infrastructure/repositories/ClienteRepositoryPrisma');
const ClienteService = require('./application/useCases/ClienteService');
const ClienteController = require('./interfaces/controllers/ClienteController');

const clienteRepository = new ClienteRepositoryPrisma(prisma);
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);

module.exports = {
  prisma,
  clienteRepository,
  clienteService,
  clienteController,
};

