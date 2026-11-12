const { Router } = require('express');
const { materialController } = require('../../container');
const validate = require('../middlewares/validate');
const {
  criarMaterialSchema,
  atualizarMaterialSchema,
  movimentarEstoqueSchema,
  idParamSchema,
} = require('../validators/materialSchemas');

const router = Router();

router.post(
  '/',
  validate(criarMaterialSchema, 'body'),
  materialController.criar,
);
router.get('/', materialController.listar);
router.get(
  '/:id',
  validate(idParamSchema, 'params'),
  materialController.buscarPorId,
);
router.put(
  '/:id',
  validate(idParamSchema, 'params'),
  validate(atualizarMaterialSchema, 'body'),
  materialController.atualizar,
);
router.post(
  '/:id/estoque/abater',
  validate(idParamSchema, 'params'),
  validate(movimentarEstoqueSchema, 'body'),
  materialController.abaterEstoque,
);
router.post(
  '/:id/estoque/repor',
  validate(idParamSchema, 'params'),
  validate(movimentarEstoqueSchema, 'body'),
  materialController.reporEstoque,
);
router.delete(
  '/:id',
  validate(idParamSchema, 'params'),
  materialController.deletar,
);

module.exports = router;
