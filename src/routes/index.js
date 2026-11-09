const { Router } = require('express');
const clienteRoutes = require('../interfaces/routes/clienteRoutes');

const router = Router();

router.use('/clientes', clienteRoutes);

// Registre aqui as rotas de cada recurso, ex.:
// router.use('/pedidos', require('./pedidoRoutes'));
// router.use('/materiais', require('./materialRoutes'));

module.exports = router;
