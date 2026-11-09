const { Router } = require('express');
const { clienteController } = require('../../container');
const validate = require('../middlewares/validate');
const {
  criarClienteSchema,
  atualizarClienteSchema,
  idParamSchema,
} = require('../validators/clienteSchemas');

const router = Router();

router.post('/', validate(criarClienteSchema, 'body'), clienteController.criar);
router.get('/', clienteController.listar);
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  clienteController.buscarPorId,
);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(atualizarClienteSchema, 'body'),
  clienteController.atualizar,
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  clienteController.deletar,
);

module.exports = router;
