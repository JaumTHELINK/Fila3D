const Material = require('../src/domain/entities/Material');
const TipoMaterial = require('../src/domain/entities/TipoMaterial');
const IMaterialRepository = require('../src/domain/repositories/IMaterialRepository');
const MaterialRepositoryPrisma = require('../src/infrastructure/repositories/MaterialRepositoryPrisma');

describe('IMaterialRepository', () => {
  it('métodos não implementados devem rejeitar', async () => {
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
    await expect(repository.abaterEstoque(1, 1)).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.reporEstoque(1, 1)).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repository.deletar(1)).rejects.toThrow(
      'Método não implementado',
    );
  });
});

describe('MaterialRepositoryPrisma', () => {
  let prisma;
  let repository;

  const registro = {
    id: 1,
    nome: 'Filamento PLA',
    tipo: TipoMaterial.PLA,
    precoPorGrama: 0.12,
    estoqueGramas: 1000,
  };

  beforeEach(() => {
    prisma = {
      material: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        updateMany: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new MaterialRepositoryPrisma(prisma);
  });

  it('deve exigir PrismaClient', () => {
    expect(() => new MaterialRepositoryPrisma()).toThrow(
      'PrismaClient deve ser fornecido no construtor.',
    );
  });

  it('criar deve persistir dados e retornar entidade', async () => {
    prisma.material.create.mockResolvedValue(registro);

    const resultado = await repository.criar(new Material(registro));

    expect(prisma.material.create).toHaveBeenCalledWith({
      data: {
        nome: 'Filamento PLA',
        tipo: TipoMaterial.PLA,
        precoPorGrama: 0.12,
        estoqueGramas: 1000,
      },
    });
    expect(resultado).toBeInstanceOf(Material);
  });

  it('buscarPorId deve mapear registro ou retornar null', async () => {
    prisma.material.findUnique.mockResolvedValue(registro);

    await expect(repository.buscarPorId('1')).resolves.toBeInstanceOf(Material);
    expect(prisma.material.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });

    prisma.material.findUnique.mockResolvedValue(null);
    await expect(repository.buscarPorId(2)).resolves.toBeNull();
  });

  it('listar deve converter os registros em entidades', async () => {
    prisma.material.findMany.mockResolvedValue([registro]);

    const materiais = await repository.listar();

    expect(materiais).toHaveLength(1);
    expect(materiais[0]).toBeInstanceOf(Material);
  });

  it('atualizar deve enviar apenas os campos fornecidos', async () => {
    prisma.material.update.mockResolvedValue({
      ...registro,
      nome: 'PLA Premium',
    });

    await repository.atualizar(1, { nome: 'PLA Premium' });

    expect(prisma.material.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'PLA Premium' },
    });
  });

  it('abaterEstoque deve debitar atomicamente e retornar material atualizado', async () => {
    prisma.material.updateMany.mockResolvedValue({ count: 1 });
    prisma.material.findUnique.mockResolvedValue({
      ...registro,
      estoqueGramas: 750,
    });

    const resultado = await repository.abaterEstoque(1, 250);

    expect(prisma.material.updateMany).toHaveBeenCalledWith({
      where: { id: 1, estoqueGramas: { gte: 250 } },
      data: { estoqueGramas: { decrement: 250 } },
    });
    expect(resultado.estoqueGramas).toBe(750);
  });

  it('abaterEstoque deve retornar null se não puder debitar', async () => {
    prisma.material.updateMany.mockResolvedValue({ count: 0 });

    await expect(repository.abaterEstoque(1, 1500)).resolves.toBeNull();
    expect(prisma.material.findUnique).not.toHaveBeenCalled();
  });

  it('reporEstoque deve incrementar o estoque atomicamente', async () => {
    prisma.material.update.mockResolvedValue({
      ...registro,
      estoqueGramas: 1250,
    });

    await repository.reporEstoque('1', 250);

    expect(prisma.material.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { estoqueGramas: { increment: 250 } },
    });
  });

  it('deletar deve chamar Prisma com id numérico', async () => {
    prisma.material.delete.mockResolvedValue(registro);

    await expect(repository.deletar('1')).resolves.toBe(true);
    expect(prisma.material.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
  });
});
