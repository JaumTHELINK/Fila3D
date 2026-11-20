// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
const PedidoState = require('./PedidoState');
const StatusPedido = require('../entities/StatusPedido');
const AprovadoState = require('./AprovadoState');
const CanceladoState = require('./CanceladoState');

class OrcamentoState extends PedidoState {
  nome() {
    return StatusPedido.ORCAMENTO;
  }

  aprovar(pedido) {
    pedido.definirEstado(new AprovadoState());
  }

  cancelar(pedido) {
    pedido.definirEstado(new CanceladoState());
  }
}

module.exports = OrcamentoState;
