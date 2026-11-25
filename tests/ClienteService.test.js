jest.mock('../src/infrastructure/repositories/ClienteRepositoryPrisma');

const Cliente = require('../src/domain/entities/Cliente');
const TipoCliente = require('../src/domain/entities/TipoCliente');
const ClienteService = require('../src/application/useCases/ClienteService');
const ClienteRepositoryPrisma = require('../src/infrastructure/repositories/ClienteRepositoryPrisma');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../src/utils/errors');

describe('ClienteService', () => {
  let repository;
  let service;

  const clienteDados = {
    id: 1,
    nome: 'Ana Silva',
    email: 'ana@email.com',
    tipo: TipoCliente.PESSOA_FISICA,
  };

  beforeEach(() => {
    repository = new ClienteRepositoryPrisma();
    service = new ClienteService(repository);
  });

  it('deve exigir um repositório no construtor', () => {
    expect(() => new ClienteService()).toThrow(
      'clienteRepository deve ser fornecido no construtor.',
    );
  });

  it('cria cliente válido e normaliza os dados', async () => {
    repository.buscarPorEmail.mockResolvedValue(null);
    repository.criar.mockImplementation(async (cliente) => cliente);

    const resultado = await service.criar({
      ...clienteDados,
      id: undefined,
      nome: '  Ana Silva  ',
      email: '  ANA@EMAIL.COM  ',
    });

    expect(resultado).toBeInstanceOf(Cliente);
    expect(resultado.id).toBeNull();
    expect(resultado.nome).toBe('Ana Silva');
    expect(resultado.email).toBe('ana@email.com');
  });

  it('rejeita dados inválidos sem criar cliente', async () => {
    await expect(
      service.criar({ ...clienteDados, email: 'inválido' }),
    ).rejects.toBeInstanceOf(RegraDeNegocioError);

    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('rejeita e-mail que já pertence a outro cliente', async () => {
    repository.buscarPorEmail.mockResolvedValue(new Cliente(clienteDados));

    await expect(service.criar(clienteDados)).rejects.toThrow(
      'Já existe um cliente cadastrado com este e-mail.',
    );
    expect(repository.criar).not.toHaveBeenCalled();
  });

  it('retorna a lista de clientes', async () => {
    const clientes = [new Cliente(clienteDados)];
    repository.listar.mockResolvedValue(clientes);

    await expect(service.listar()).resolves.toEqual(clientes);
  });

  it('busca cliente existente e retorna not-found quando ausente', async () => {
    repository.buscarPorId
      .mockResolvedValueOnce(new Cliente(clienteDados))
      .mockResolvedValueOnce(null);

    await expect(service.buscarPorId(1)).resolves.toMatchObject({
      id: 1,
      nome: 'Ana Silva',
    });
    await expect(service.buscarPorId(999)).rejects.toBeInstanceOf(
      NaoEncontradoError,
    );
  });

  it('atualiza parcialmente mantendo os outros dados do cliente', async () => {
    repository.buscarPorId.mockResolvedValue(new Cliente(clienteDados));
    repository.atualizar.mockImplementation(async (id, dados) => ({
      id,
      ...dados,
    }));

    const resultado = await service.atualizar(1, { nome: 'Ana Souza' });

    expect(resultado).toMatchObject({
      id: 1,
      nome: 'Ana Souza',
      email: 'ana@email.com',
      tipo: TipoCliente.PESSOA_FISICA,
    });
  });

  it('rejeita atualização quando o novo e-mail pertence a outro cliente', async () => {
    repository.buscarPorId.mockResolvedValue(new Cliente(clienteDados));
    repository.buscarPorEmail.mockResolvedValue(
      new Cliente({
        ...clienteDados,
        id: 2,
        email: 'outra@email.com',
      }),
    );

    await expect(
      service.atualizar(1, { email: 'outra@email.com' }),
    ).rejects.toThrow('Já existe um cliente cadastrado com este e-mail.');
    expect(repository.atualizar).not.toHaveBeenCalled();
  });

  it('retorna not-found ao atualizar ou remover cliente ausente', async () => {
    repository.buscarPorId.mockResolvedValue(null);

    await expect(service.atualizar(999, { nome: 'Novo Nome' })).rejects.toThrow(
      NaoEncontradoError,
    );
    await expect(service.deletar(999)).rejects.toThrow(NaoEncontradoError);
    expect(repository.deletar).not.toHaveBeenCalled();
  });

  it('remove cliente existente e retorna confirmação', async () => {
    repository.buscarPorId.mockResolvedValue(new Cliente(clienteDados));
    repository.deletar.mockResolvedValue(true);

    await expect(service.deletar(1)).resolves.toEqual({
      mensagem: 'Cliente removido com sucesso.',
    });
  });
});
