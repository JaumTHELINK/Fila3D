// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
const PedidoState = require('./PedidoState');
const StatusPedido = require('../entities/StatusPedido');
const ImprimindoState = require('./ImprimindoState');
const CanceladoState = require('./CanceladoState');

class AprovadoState extends PedidoState {
  nome() {
    return StatusPedido.APROVADO;
  }

  iniciarImpressao(pedido) {
    pedido.definirEstado(new ImprimindoState());
  }

  cancelar(pedido) {
    pedido.definirEstado(new CanceladoState());
  }
}

module.exports = AprovadoState;

