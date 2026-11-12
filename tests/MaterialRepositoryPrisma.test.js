const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');
const IMaterialRepository = require('../src/domain/repositories/IMaterialRepository');
const MaterialRepositoryPrisma = require('../src/infrastructure/repositories/MaterialRepositoryPrisma');

describe('IMaterialRepository', () => {
  it('métodos da interface base devem lançar "Método não implementado"', async () => {
    const repository = new IMaterialRepository();

    await expect(repository.criar({})).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.buscarPorId(1)).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.listar()).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.atualizar(1, {})).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.deletar(1)).rejects.toThrow(
      'Método não implementado',
    );
  });
});

describe('MaterialRepositoryPrisma', () => {
  let mockPrisma;
  let repository;

  beforeEach(() => {
    mockPrisma = {
      material: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new MaterialRepositoryPrisma(mockPrisma);
  });

  it('deve exigir PrismaClient no construtor', () => {
    expect(() => new MaterialRepositoryPrisma()).toThrow(
      'PrismaClient deve ser fornecido no construtor.',
    );
  });

  it('criar deve persistir material e retornar a entidade', async () => {
    const material = new Material({
      nome: 'Filamento PLA',
      tipo: TipoMaterial.PLA,
      precoPorGrama: 0.12,
      estoqueGramas: 1000,
    });
    mockPrisma.material.create.mockResolvedValue({
      ...material,
      id: 1,
    });

    const resultado = await repository.criar(material);

    expect(mockPrisma.material.create).toHaveBeenCalledWith({
      data: {
        nome: 'Filamento PLA',
        tipo: TipoMaterial.PLA,
        precoPorGrama: 0.12,
        estoqueGramas: 1000,
      },
    });
    expect(resultado).toBeInstanceOf(Material);
    expect(resultado.id).toBe(1);
  });

  it('buscarPorId deve retornar entidade ou null', async () => {
    mockPrisma.material.findUnique.mockResolvedValue({
      id: 2,
      nome: 'Filamento TPU',
      tipo: TipoMaterial.TPU,
      precoPorGrama: 0.2,
      estoqueGramas: 500,
    });

    const encontrado = await repository.buscarPorId('2');
    expect(mockPrisma.material.findUnique).toHaveBeenCalledWith({
      where: { id: 2 },
    });
    expect(encontrado).toBeInstanceOf(Material);
    expect(encontrado.tipo).toBe(TipoMaterial.TPU);

    mockPrisma.material.findUnique.mockResolvedValue(null);
    await expect(repository.buscarPorId(999)).resolves.toBeNull();
  });

  it('listar deve converter os registros em entidades', async () => {
    mockPrisma.material.findMany.mockResolvedValue([
      {
        id: 1,
        nome: 'PLA',
        tipo: TipoMaterial.PLA,
        precoPorGrama: 0.12,
        estoqueGramas: 1000,
      },
    ]);

    const resultado = await repository.listar();

    expect(resultado).toHaveLength(1);
    expect(resultado[0]).toBeInstanceOf(Material);
  });

  it('atualizar deve enviar apenas os campos informados', async () => {
    mockPrisma.material.update.mockResolvedValue({
      id: 1,
      nome: 'PLA atualizado',
      tipo: TipoMaterial.PLA,
      precoPorGrama: 0.15,
      estoqueGramas: 1000,
    });

    const resultado = await repository.atualizar(1, {
      nome: 'PLA atualizado',
      precoPorGrama: 0.15,
    });

    expect(mockPrisma.material.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'PLA atualizado', precoPorGrama: 0.15 },
    });
    expect(resultado).toBeInstanceOf(Material);
    expect(resultado.precoPorGrama).toBe(0.15);
  });

  it('deletar deve remover pelo id numérico', async () => {
    mockPrisma.material.delete.mockResolvedValue({ id: 4 });

    await expect(repository.deletar('4')).resolves.toBe(true);
    expect(mockPrisma.material.delete).toHaveBeenCalledWith({
      where: { id: 4 },
    });
  });
});
