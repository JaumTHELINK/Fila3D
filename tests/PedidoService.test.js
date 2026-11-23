const PedidoService = require('../src/application/useCases/PedidoService');
const Pedido = require('../src/domain/entities/Pedido');
const StatusPedido = require('../src/domain/entities/StatusPedido');
const TipoCliente = require('../src/domain/entities/TipoCliente');
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
    pedidoRepository = {
      buscarPorId: jest.fn().mockResolvedValue(criarPedido()),
      atualizar: jest.fn().mockImplementation(async (pedido) => pedido),
    };
    clienteRepository = {
      buscarPorId: jest.fn().mockResolvedValue({
        id: 10,
        tipo: TipoCliente.PESSOA_FISICA,
      }),
    };
    materialRepository = {
      buscarPorId: jest.fn().mockResolvedValue({ id: 20, precoPorGrama: 0.15 }),
    };
    service = new PedidoService(
      pedidoRepository,
      clienteRepository,
      materialRepository,
    );
  });

  it('pessoa física: aprova e salva valorTotal sem desconto', async () => {
    const pedido = await service.aprovarPedido(1);

    expect(pedido.status).toBe(StatusPedido.APROVADO);
    expect(pedido.valorTotal).toBe(115);
    expect(pedidoRepository.atualizar).toHaveBeenCalledWith(pedido);
  });

  it('empresa: aprova e salva valorTotal com 15% de desconto', async () => {
    clienteRepository.buscarPorId.mockResolvedValue({
      id: 10,
      tipo: TipoCliente.EMPRESA,
    });

    const pedido = await service.aprovarPedido(1);

    expect(pedido.valorTotal).toBe(97.75);
  });

  it('deve lançar NaoEncontradoError se o pedido não existir', async () => {
    pedidoRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.aprovarPedido(99)).rejects.toThrow(NaoEncontradoError);
  });

  it('deve lançar NaoEncontradoError se cliente ou material não existirem', async () => {
    clienteRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.aprovarPedido(1)).rejects.toThrow(NaoEncontradoError);

    clienteRepository.buscarPorId.mockResolvedValue({
      tipo: TipoCliente.EMPRESA,
    });
    materialRepository.buscarPorId.mockResolvedValue(null);
    await expect(service.aprovarPedido(1)).rejects.toThrow(NaoEncontradoError);
  });

  it('deve lançar RegraDeNegocioError e não salvar se o pedido já foi aprovado', async () => {
    const pedido = criarPedido();
    pedido.aprovar();
    pedidoRepository.buscarPorId.mockResolvedValue(pedido);

    await expect(service.aprovarPedido(1)).rejects.toThrow(RegraDeNegocioError);
    expect(pedidoRepository.atualizar).not.toHaveBeenCalled();
  });

  it('deve exigir os três repositories no construtor', () => {
    expect(() => new PedidoService(pedidoRepository)).toThrow();
  });
});
