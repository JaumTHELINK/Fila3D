const MaterialController = require('../src/interfaces/controllers/MaterialController');

describe('MaterialController', () => {
  const criarResposta = () => {
    const res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    res.status.mockReturnValue(res);
    return res;
  };

  it('deve exigir MaterialService no construtor', () => {
    expect(() => new MaterialController()).toThrow(
      'materialService deve ser fornecido no construtor.',
    );
  });

  it('criar deve responder com status 201 e o material', async () => {
    const material = { id: 1 };
    const materialService = { criar: jest.fn().mockResolvedValue(material) };
    const controller = new MaterialController(materialService);
    const req = { body: { nome: 'PLA' } };
    const res = criarResposta();
    const next = jest.fn();

    await controller.criar(req, res, next);

    expect(materialService.criar).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(material);
    expect(next).not.toHaveBeenCalled();
  });

  it('deve delegar movimentação de estoque e encaminhar erros', async () => {
    const erro = new Error('falha');
    const materialService = {
      abaterEstoque: jest.fn().mockRejectedValue(erro),
      reporEstoque: jest.fn().mockResolvedValue({ estoqueGramas: 150 }),
    };
    const controller = new MaterialController(materialService);
    const req = { params: { id: '2' }, body: { gramas: 50 } };
    const res = criarResposta();
    const next = jest.fn();

    await controller.abaterEstoque(req, res, next);
    expect(materialService.abaterEstoque).toHaveBeenCalledWith('2', 50);
    expect(next).toHaveBeenCalledWith(erro);

    next.mockClear();
    await controller.reporEstoque(req, res, next);
    expect(materialService.reporEstoque).toHaveBeenCalledWith('2', 50);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ estoqueGramas: 150 });
    expect(next).not.toHaveBeenCalled();
  });
});
