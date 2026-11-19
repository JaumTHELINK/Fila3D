const errorHandler = require('../src/middlewares/errorHandler');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
  ValidacaoError,
} = require('../src/utils/errors');

describe('errorHandler', () => {
  let res;

  beforeEach(() => {
    res = {
      status: jest.fn(),
      json: jest.fn(),
    };
    res.status.mockReturnValue(res);
  });

  it('deve responder com status 400 para erro de regra de negócio', () => {
    errorHandler(new RegraDeNegocioError('Dados inválidos.'), {}, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ erro: 'Dados inválidos.' });
  });

  it('deve responder com status 404 para recurso não encontrado', () => {
    errorHandler(new NaoEncontradoError('Material não encontrado.'), {}, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Material não encontrado.',
    });
  });

  it('deve incluir os problemas da validação na resposta', () => {
    const problemas = [{ campo: 'nome', mensagem: 'Nome inválido.' }];

    errorHandler(new ValidacaoError(undefined, problemas), {}, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Erro de validação dos dados de entrada.',
      problemas,
    });
  });

  it('deve responder com status 400 para violação de unicidade do Prisma', () => {
    errorHandler({ code: 'P2002' }, {}, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Já existe um registro com esses dados.',
    });
  });

  it('deve ocultar detalhes de erros internos e registrá-los', () => {
    const erro = new Error('Informação interna');
    const consoleError = jest.spyOn(console, 'error').mockImplementation();

    errorHandler(erro, {}, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      erro: 'Erro interno do servidor',
    });
    expect(consoleError).toHaveBeenCalledWith(erro);
    consoleError.mockRestore();
  });
});
