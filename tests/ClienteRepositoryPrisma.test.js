const Cliente = require('../src/domain/entities/Cliente');
const TipoCliente = require('../src/domain/entities/TipoCliente');
const IClienteRepository = require('../src/domain/repositories/IClienteRepository');
const ClienteRepositoryPrisma = require('../src/infrastructure/repositories/ClienteRepositoryPrisma');

describe('IClienteRepository', () => {
  it('todos os métodos da interface base devem lançar "Método não implementado"', async () => {
    const repo = new IClienteRepository();

    await expect(repo.criar({})).rejects.toThrow('Método não implementado');
    await expect(repo.buscarPorId(1)).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repo.buscarPorEmail('a@b.com')).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repo.listar()).rejects.toThrow('Método não implementado');
    await expect(repo.atualizar(1, {})).rejects.toThrow(
      'Método não implementado',
    );
    await expect(repo.deletar(1)).rejects.toThrow('Método não implementado');
  });
});

describe('ClienteRepositoryPrisma', () => {
  let mockPrisma;
  let repository;

  beforeEach(() => {
    mockPrisma = {
      cliente: {
        create: jest.fn(),
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };
    repository = new ClienteRepositoryPrisma(mockPrisma);
  });

  it('deve lançar erro se o PrismaClient não for fornecido no construtor', () => {
    expect(() => new ClienteRepositoryPrisma()).toThrow(
      'PrismaClient deve ser fornecido no construtor.',
    );
  });

  it('criar: deve persistir e retornar uma instância de Cliente', async () => {
    const clienteEntrada = new Cliente({
      nome: 'Lucas Silva',
      email: 'lucas@email.com',
      tipo: TipoCliente.PESSOA_FISICA,
    });

    mockPrisma.cliente.create.mockResolvedValue({
      id: 1,
      nome: 'Lucas Silva',
      email: 'lucas@email.com',
      tipo: 'PESSOA_FISICA',
    });

    const resultado = await repository.criar(clienteEntrada);

    expect(mockPrisma.cliente.create).toHaveBeenCalledWith({
      data: {
        nome: 'Lucas Silva',
        email: 'lucas@email.com',
        tipo: 'PESSOA_FISICA',
      },
    });
    expect(resultado).toBeInstanceOf(Cliente);
    expect(resultado.id).toBe(1);
    expect(resultado.nome).toBe('Lucas Silva');
  });

  it('buscarPorId: deve retornar instância de Cliente quando encontrado', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue({
      id: 5,
      nome: 'Empresa Alfa',
      email: 'contato@alfa.com',
      tipo: 'EMPRESA',
    });

    const resultado = await repository.buscarPorId(5);

    expect(mockPrisma.cliente.findUnique).toHaveBeenCalledWith({
      where: { id: 5 },
    });
    expect(resultado).toBeInstanceOf(Cliente);
    expect(resultado.id).toBe(5);
    expect(resultado.tipo).toBe(TipoCliente.EMPRESA);
  });

  it('buscarPorId: deve retornar null quando não encontrado', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue(null);

    const resultado = await repository.buscarPorId(999);

    expect(resultado).toBeNull();
  });

  it('buscarPorEmail: deve retornar instância de Cliente com email formatado', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue({
      id: 3,
      nome: 'Mariana Lima',
      email: 'mariana@email.com',
      tipo: 'PESSOA_FISICA',
    });

    const resultado = await repository.buscarPorEmail('  Mariana@Email.COM  ');

    expect(mockPrisma.cliente.findUnique).toHaveBeenCalledWith({
      where: { email: 'mariana@email.com' },
    });
    expect(resultado).toBeInstanceOf(Cliente);
    expect(resultado.id).toBe(3);
  });

  it('buscarPorEmail: deve retornar null se não encontrar ou se email for falsy', async () => {
    mockPrisma.cliente.findUnique.mockResolvedValue(null);

    const resultado1 = await repository.buscarPorEmail('inexistente@email.com');
    const resultado2 = await repository.buscarPorEmail(null);

    expect(resultado1).toBeNull();
    expect(resultado2).toBeNull();
  });

  it('listar: deve retornar uma lista de instâncias de Cliente', async () => {
    mockPrisma.cliente.findMany.mockResolvedValue([
      { id: 1, nome: 'Cli 1', email: 'c1@email.com', tipo: 'PESSOA_FISICA' },
      { id: 2, nome: 'Cli 2', email: 'c2@email.com', tipo: 'EMPRESA' },
    ]);

    const resultado = await repository.listar();

    expect(mockPrisma.cliente.findMany).toHaveBeenCalled();
    expect(resultado).toHaveLength(2);
    expect(resultado[0]).toBeInstanceOf(Cliente);
    expect(resultado[1]).toBeInstanceOf(Cliente);
  });

  it('atualizar: deve enviar apenas campos fornecidos e retornar Cliente atualizado', async () => {
    mockPrisma.cliente.update.mockResolvedValue({
      id: 1,
      nome: 'Nome Atualizado',
      email: 'antigo@email.com',
      tipo: 'PESSOA_FISICA',
    });

    const resultado = await repository.atualizar(1, {
      nome: 'Nome Atualizado',
    });

    expect(mockPrisma.cliente.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { nome: 'Nome Atualizado' },
    });
    expect(resultado).toBeInstanceOf(Cliente);
    expect(resultado.nome).toBe('Nome Atualizado');
  });

  it('deletar: deve chamar prisma.cliente.delete com id numérico', async () => {
    mockPrisma.cliente.delete.mockResolvedValue({ id: 1 });

    const resultado = await repository.deletar('1');

    expect(mockPrisma.cliente.delete).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(resultado).toBe(true);
  });
});
