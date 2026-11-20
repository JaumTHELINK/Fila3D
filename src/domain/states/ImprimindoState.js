// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
const PedidoState = require('./PedidoState');
const StatusPedido = require('../entities/StatusPedido');
const ConcluidoState = require('./ConcluidoState');

class ImprimindoState extends PedidoState {
  nome() {
    return StatusPedido.IMPRIMINDO;
  }

  concluir(pedido) {
    pedido.definirEstado(new ConcluidoState());
  }
}

module.exports = ImprimindoState;

