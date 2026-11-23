const CalculadoraDePreco = require('../../domain/services/CalculadoraDePreco');
const PrecoPessoaFisicaStrategy = require('../../domain/strategies/PrecoPessoaFisicaStrategy');
const PrecoEmpresaStrategy = require('../../domain/strategies/PrecoEmpresaStrategy');
const TipoCliente = require('../../domain/entities/TipoCliente');
const {
  NaoEncontradoError,
  RegraDeNegocioError,
} = require('../../utils/errors');

class PedidoService {
  constructor(pedidoRepository, clienteRepository, materialRepository) {
    if (!pedidoRepository || !clienteRepository || !materialRepository) {
      throw new Error(
        'pedidoRepository, clienteRepository e materialRepository devem ser fornecidos.',
      );
    }
    this.pedidoRepository = pedidoRepository;
    this.clienteRepository = clienteRepository;
    this.materialRepository = materialRepository;
  }

  async aprovarPedido(id) {
    const pedido = await this.pedidoRepository.buscarPorId(id);
    if (!pedido) {
      throw new NaoEncontradoError('Pedido não encontrado.');
    }

    const cliente = await this.clienteRepository.buscarPorId(pedido.clienteId);
    if (!cliente) {
      throw new NaoEncontradoError('Cliente do pedido não encontrado.');
    }

    const material = await this.materialRepository.buscarPorId(
      pedido.materialId,
    );
    if (!material) {
      throw new NaoEncontradoError('Material do pedido não encontrado.');
    }

    const calculadora = new CalculadoraDePreco(
      this._escolherStrategy(cliente.tipo),
    );
    const valorTotal = calculadora.calcular(
      Number(pedido.pesoGramas),
      Number(pedido.tempoHoras),
      Number(material.precoPorGrama),
    );

    try {
      pedido.aprovar();
    } catch (error) {
      throw new RegraDeNegocioError(error.message);
    }
    pedido.valorTotal = valorTotal;

    return await this.pedidoRepository.atualizar(pedido);
  }

  _escolherStrategy(tipoCliente) {
    if (tipoCliente === TipoCliente.PESSOA_FISICA) {
      return new PrecoPessoaFisicaStrategy();
    }
    if (tipoCliente === TipoCliente.EMPRESA) {
      return new PrecoEmpresaStrategy();
    }
    throw new RegraDeNegocioError(
      `Tipo de cliente sem estratégia de preço: ${tipoCliente}`,
    );
  }
}

module.exports = PedidoService;
