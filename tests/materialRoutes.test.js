const express = require('express');
const request = require('supertest');

jest.mock('../src/container', () => ({
  materialController: {
    criar: jest.fn((req, res) => res.status(201).json({ sucesso: true })),
    listar: jest.fn((req, res) => res.status(200).json([])),
    buscarPorId: jest.fn((req, res) =>
      res.status(200).json({ id: Number(req.params.id) }),
    ),
    atualizar: jest.fn((req, res) => res.status(200).json(req.body)),
    abaterEstoque: jest.fn((req, res) =>
      res.status(200).json({ gramas: req.body.gramas }),
    ),
    reporEstoque: jest.fn((req, res) =>
      res.status(200).json({ gramas: req.body.gramas }),
    ),
    deletar: jest.fn((req, res) =>
      res.status(200).json({ mensagem: 'Material removido com sucesso.' }),
    ),
  },
}));

const materialRoutes = require('../src/interfaces/routes/materialRoutes');
const errorHandler = require('../src/middlewares/errorHandler');
const { materialController } = require('../src/container');

describe('Rotas de Material', () => {
  const app = express();

  app.use(express.json());
  app.use('/materiais', materialRoutes);
  app.use(errorHandler);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve aceitar criação e listagem de materiais', async () => {
    await request(app)
      .post('/materiais')
      .send({
        nome: 'Filamento PLA',
        tipo: 'PLA',
        precoPorGrama: 0.12,
        estoqueGramas: 1000,
      })
      .expect(201);

    await request(app).get('/materiais').expect(200);
    expect(materialController.criar).toHaveBeenCalledTimes(1);
    expect(materialController.listar).toHaveBeenCalledTimes(1);
  });

  it('deve validar id e quantidade nas rotas de estoque', async () => {
    await request(app)
      .post('/materiais/2/estoque/abater')
      .send({ gramas: 25 })
      .expect(200);
    expect(materialController.abaterEstoque).toHaveBeenCalledTimes(1);

    await request(app)
      .post('/materiais/abc/estoque/repor')
      .send({ gramas: 25 })
      .expect(400);
    await request(app)
      .post('/materiais/2/estoque/repor')
      .send({ gramas: 0 })
      .expect(400);
    expect(materialController.reporEstoque).not.toHaveBeenCalled();
  });

  it('deve validar campos obrigatórios antes de criar', async () => {
    await request(app).post('/materiais').send({ nome: 'PLA' }).expect(400);
    expect(materialController.criar).not.toHaveBeenCalled();
  });
});
