const prisma = require('./database');
const ClienteRepositoryPrisma = require('./infrastructure/repositories/ClienteRepositoryPrisma');
const ClienteService = require('./application/useCases/ClienteService');
const ClienteController = require('./interfaces/controllers/ClienteController');
const MaterialRepositoryPrisma = require('./infrastructure/repositories/MaterialRepositoryPrisma');
const MaterialService = require('./application/useCases/MaterialService');
const MaterialController = require('./interfaces/controllers/MaterialController');

const clienteRepository = new ClienteRepositoryPrisma(prisma);
const clienteService = new ClienteService(clienteRepository);
const clienteController = new ClienteController(clienteService);
const materialRepository = new MaterialRepositoryPrisma(prisma);
const materialService = new MaterialService(materialRepository);
const materialController = new MaterialController(materialService);

module.exports = {
  prisma,
  clienteRepository,
  clienteService,
  clienteController,
  materialRepository,
  materialService,
  materialController,
};
