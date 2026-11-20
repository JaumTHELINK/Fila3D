// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
const PedidoState = require('./PedidoState');
const StatusPedido = require('../entities/StatusPedido');
const EntregueState = require('./EntregueState');

class ConcluidoState extends PedidoState {
  nome() {
    return StatusPedido.CONCLUIDO;
  }

  entregar(pedido) {
    pedido.definirEstado(new EntregueState());
  }
}

module.exports = ConcluidoState;

