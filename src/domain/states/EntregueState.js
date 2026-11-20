// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
// Estado final: não sobrescreve nenhuma ação, então todas lançam erro.
const PedidoState = require('./PedidoState');
const StatusPedido = require('../entities/StatusPedido');

class EntregueState extends PedidoState {
  nome() {
    return StatusPedido.ENTREGUE;
  }
}

module.exports = EntregueState;

