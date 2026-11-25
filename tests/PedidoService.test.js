jest.mock('../src/domain/repositories/IPedidoRepository');
jest.mock('../src/infrastructure/repositories/ClienteRepositoryPrisma');
jest.mock('../src/infrastructure/repositories/MaterialRepositoryPrisma');

const PedidoService = require('../src/application/useCases/PedidoService');
const Pedido = require('../src/domain/entities/Pedido');
const StatusPedido = require('../src/domain/entities/StatusPedido');
const TipoCliente = require('../src/domain/entities/TipoCliente');
const IPedidoRepository = require('../src/domain/repositories/IPedidoRepository');
const ClienteRepositoryPrisma = require('../src/infrastructure/repositories/ClienteRepositoryPrisma');
const MaterialRepositoryPrisma = require('../src/infrastructure/repositories/MaterialRepositoryPrisma');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../src/utils/errors');

function criarPedido() {
  return new Pedido({
    id: 1,
    clienteId: 10,
    materialId: 20,
    descricao: 'Peça teste',
    pesoGramas: 100,
    tempoHoras: 2,
  });
}

describe('PedidoService.aprovarPedido', () => {
  let pedidoRepository;
  let clienteRepository;
  let materialRepository;
  let service;

  beforeEach(() => {
    pedidoRepository = new IPedidoRepository();
    pedidoRepository.buscarPorId.mockResolvedValue(criarPedido());
    pedidoRepository.atualizar.mockImplementation(async (pedido) => pedido);

    clienteRepository = new ClienteRepositoryPrisma();
    clienteRepository.buscarPorId.mockResolvedValue({
      id: 10,
      tipo: TipoCliente.PESSOA_FISICA,
    });

    materialRepository = new MaterialRepositoryPrisma();
    materialRepository.buscarPorId.mockResolvedValue({
      id: 20,
      precoPorGrama: 0.15,
    });

    service = new PedidoService(
      pedidoRepository,
      clienteRepository,
      materialRepository,
    );
  });

  it('aprova pedido de pessoa física e retorna o valor calculado', async () => {
    const resultado = await service.aprovarPedido(1);

    expect(resultado.status).toBe(StatusPedido.APROVADO);
    expect(resultado.valorTotal).toBe(115);
  });

  it('aplica desconto para pedidos de empresa', async () => {
    clienteRepository.buscarPorId.mockResolvedValue({
      id: 10,
      tipo: TipoCliente.EMPRESA,
    });

    const resultado = await service.aprovarPedido(1);

    expect(resultado.valorTotal).toBe(97.75);
    expect(resultado.status).toBe(StatusPedido.APROVADO);
  });

  it('retorna not-found quando o pedido não existe', async () => {
    pedidoRepository.buscarPorId.mockResolvedValue(null);

    await expect(service.aprovarPedido(99)).rejects.toBeInstanceOf(
      NaoEncontradoError,
    );
  });

  it.each([
    ['cliente', () => clienteRepository.buscarPorId.mockResolvedValue(null)],
    ['material', () => materialRepository.buscarPorId.mockResolvedValue(null)],
  ])(
    'retorna not-found quando o %s associado não existe',
    async (_, arrange) => {
      arrange();

      await expect(service.aprovarPedido(1)).rejects.toBeInstanceOf(
        NaoEncontradoError,
      );
    },
  );

  it('não aprova um pedido que já saiu de orçamento', async () => {
    const pedido = criarPedido();
    pedido.aprovar();
    pedidoRepository.buscarPorId.mockResolvedValue(pedido);

    await expect(service.aprovarPedido(1)).rejects.toBeInstanceOf(
      RegraDeNegocioError,
    );
    expect(pedidoRepository.atualizar).not.toHaveBeenCalled();
  });

  it('rejeita tipo de cliente sem estratégia de preço', async () => {
    clienteRepository.buscarPorId.mockResolvedValue({
      id: 10,
      tipo: 'TIPO_DESCONHECIDO',
    });

    await expect(service.aprovarPedido(1)).rejects.toThrow(
      'Tipo de cliente sem estratégia de preço: TIPO_DESCONHECIDO',
    );
  });

  it('exige todos os repositórios para construir o service', () => {
    expect(() => new PedidoService(pedidoRepository)).toThrow(
      'pedidoRepository, clienteRepository e materialRepository devem ser fornecidos.',
    );
  });
});
