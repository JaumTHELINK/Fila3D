const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');
const MaterialService = require('../src/application/useCases/MaterialService');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../src/utils/errors');

describe('MaterialService', () => {
  let repository;
  let service;

  const materialDados = {
    id: 1,
    nome: 'Filamento PLA',
    tipo: TipoMaterial.PLA,
    precoPorGrama: 0.12,
    estoqueGramas: 1000,
  };

  beforeEach(() => {
    repository = {
      criar: jest.fn(),
      listar: jest.fn(),
      buscarPorId: jest.fn(),
      atualizar: jest.fn(),
      abaterEstoque: jest.fn(),
      reporEstoque: jest.fn(),
      deletar: jest.fn(),
    };
    service = new MaterialService(repository);
  });

  it('deve exigir um repositório no construtor', () => {
    expect(() => new MaterialService()).toThrow(
      'materialRepository deve ser fornecido no construtor.',
    );
  });

  it('criar deve validar dados e persistir uma entidade Material', async () => {
    repository.criar.mockImplementation(async (material) => material);

    const resultado = await service.criar({
      ...materialDados,
      id: undefined,
    });

    expect(repository.criar).toHaveBeenCalledWith(expect.any(Material));
    expect(resultado).toBeInstanceOf(Material);
    expect(resultado.id).toBeNull();
  });

  it('criar deve converter dados inválidos em erro de regra de negócio', async () => {
    await expect(
      service.criar({ ...materialDados, precoPorGrama: 0 }),
    ).rejects.toBeInstanceOf(RegraDeNegocioError);
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('listar deve retornar os materiais do repositório', async () => {
    const materiais = [new Material(materialDados)];
    repository.listar.mockResolvedValue(materiais);

    await expect(service.listar()).resolves.toBe(materiais);
  });

  it('buscarPorId deve falhar quando o material não existir', async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.buscarPorId(999)).rejects.toBeInstanceOf(
      NaoEncontradoError,
    );
  });

  it('atualizar deve preservar campos omitidos e validar os dados combinados', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.atualizar.mockImplementation(async (id, dados) => ({
      id,
      ...dados,
    }));

    const resultado = await service.atualizar(1, { nome: 'PLA Premium' });

    expect(repository.atualizar).toHaveBeenCalledWith(1, {
      nome: 'PLA Premium',
      tipo: TipoMaterial.PLA,
      precoPorGrama: 0.12,
      estoqueGramas: 1000,
    });
    expect(resultado.nome).toBe('PLA Premium');
  });

  it('atualizar deve rejeitar material inválido', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));

    await expect(
      service.atualizar(1, { precoPorGrama: 0 }),
    ).rejects.toBeInstanceOf(RegraDeNegocioError);
    expect(repository.atualizar).not.toHaveBeenCalled();
  });

  it('abaterEstoque deve persistir o saldo atualizado', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.abaterEstoque.mockResolvedValue({
      ...materialDados,
      estoqueGramas: 750,
    });

    const resultado = await service.abaterEstoque(1, 250);

    expect(repository.abaterEstoque).toHaveBeenCalledWith(1, 250);
    expect(resultado.estoqueGramas).toBe(750);
  });

  it('abaterEstoque deve rejeitar quantidade acima do saldo', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));

    await expect(service.abaterEstoque(1, 1001)).rejects.toBeInstanceOf(
      RegraDeNegocioError,
    );
    expect(repository.abaterEstoque).not.toHaveBeenCalled();
  });

  it('reporEstoque deve persistir o saldo atualizado', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.reporEstoque.mockResolvedValue({
      ...materialDados,
      estoqueGramas: 1250,
    });

    const resultado = await service.reporEstoque(1, 250);

    expect(repository.reporEstoque).toHaveBeenCalledWith(1, 250);
    expect(resultado.estoqueGramas).toBe(1250);
  });

  it('deletar deve verificar existência antes de remover', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.deletar.mockResolvedValue(true);

    await expect(service.deletar(1)).resolves.toEqual({
      mensagem: 'Material removido com sucesso.',
    });
    expect(repository.deletar).toHaveBeenCalledWith(1);
  });
});
