const { Router } = require('express');
const clienteRoutes = require('../interfaces/routes/clienteRoutes');
const materialRoutes = require('../interfaces/routes/materialRoutes');

const router = Router();

router.use('/clientes', clienteRoutes);
router.use('/materiais', materialRoutes);

module.exports = router;
