// Padrão GoF: State. Resolve: elimina if/else de status no Pedido e permite novos estados sem alterar a classe Pedido (Open/Closed).
class PedidoState {
  nome() {
    throw new Error('Método não implementado');
  }

  aprovar(_pedido) {
    this._transicaoInvalida('aprovar');
  }

  iniciarImpressao(_pedido) {
    this._transicaoInvalida('iniciar a impressão de');
  }

  concluir(_pedido) {
    this._transicaoInvalida('concluir');
  }

  entregar(_pedido) {
    this._transicaoInvalida('entregar');
  }

  cancelar(_pedido) {
    this._transicaoInvalida('cancelar');
  }

  _transicaoInvalida(acao) {
    throw new Error(
      `Transição inválida: não é possível ${acao} um pedido com status ${this.nome()}`,
    );
  }
}

module.exports = PedidoState;

