jest.mock('../src/infrastructure/repositories/MaterialRepositoryPrisma');

const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');
const MaterialService = require('../src/application/useCases/MaterialService');
const MaterialRepositoryPrisma = require('../src/infrastructure/repositories/MaterialRepositoryPrisma');
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
    repository = new MaterialRepositoryPrisma();
    service = new MaterialService(repository);
  });

  it('deve exigir um repositório no construtor', () => {
    expect(() => new MaterialService()).toThrow(
      'materialRepository deve ser fornecido no construtor.',
    );
  });

  it('deve criar material válido com nome normalizado', async () => {
    repository.criar.mockImplementation(async (material) => material);

    const resultado = await service.criar({
      ...materialDados,
      id: undefined,
      nome: '  Filamento PLA  ',
    });

    expect(resultado).toBeInstanceOf(Material);
    expect(resultado.id).toBeNull();
    expect(resultado.nome).toBe('Filamento PLA');
  });

  it('deve rejeitar material inválido sem persistir', async () => {
    await expect(
      service.criar({ ...materialDados, precoPorGrama: 0 }),
    ).rejects.toBeInstanceOf(RegraDeNegocioError);

    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('deve retornar a lista de materiais', async () => {
    const materiais = [new Material(materialDados)];
    repository.listar.mockResolvedValue(materiais);

    await expect(service.listar()).resolves.toEqual(materiais);
  });

  it('deve retornar material encontrado e not-found quando ausente', async () => {
    repository.buscarPorId.mockResolvedValueOnce(new Material(materialDados));
    repository.buscarPorId.mockResolvedValueOnce(null);

    await expect(service.buscarPorId(1)).resolves.toMatchObject({
      id: 1,
      nome: 'Filamento PLA',
    });
    await expect(service.buscarPorId(999)).rejects.toBeInstanceOf(
      NaoEncontradoError,
    );
  });

  it('deve preservar campos omitidos na atualização parcial', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.atualizar.mockImplementation(async (id, dados) => ({
      id,
      ...dados,
    }));

    const resultado = await service.atualizar(1, { nome: 'PLA Premium' });

    expect(resultado).toMatchObject({
      id: 1,
      nome: 'PLA Premium',
      tipo: TipoMaterial.PLA,
      precoPorGrama: 0.12,
    });
  });

  it('deve rejeitar atualização inválida ou alteração direta do estoque', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));

    await expect(
      service.atualizar(1, { precoPorGrama: 0 }),
    ).rejects.toBeInstanceOf(RegraDeNegocioError);
    await expect(service.atualizar(1, { estoqueGramas: 500 })).rejects.toThrow(
      'O estoque deve ser alterado pelas operações de abater ou repor.',
    );

    expect(repository.atualizar).not.toHaveBeenCalled();
  });

  it('deve abater estoque quando houver saldo suficiente', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.abaterEstoque.mockResolvedValue({
      ...materialDados,
      estoqueGramas: 750,
    });

    const resultado = await service.abaterEstoque(1, 250);

    expect(resultado.estoqueGramas).toBe(750);
  });

  it('deve impedir abatimento maior que o saldo disponível', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));

    await expect(service.abaterEstoque(1, 1001)).rejects.toBeInstanceOf(
      RegraDeNegocioError,
    );
    expect(repository.abaterEstoque).not.toHaveBeenCalled();
  });

  it('deve repor estoque e retornar o saldo atualizado', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.reporEstoque.mockResolvedValue({
      ...materialDados,
      estoqueGramas: 1250,
    });

    const resultado = await service.reporEstoque(1, 250);

    expect(resultado.estoqueGramas).toBe(1250);
  });

  it('deve remover material existente', async () => {
    repository.buscarPorId.mockResolvedValue(new Material(materialDados));
    repository.deletar.mockResolvedValue(true);

    await expect(service.deletar(1)).resolves.toEqual({
      mensagem: 'Material removido com sucesso.',
    });
  });
});
