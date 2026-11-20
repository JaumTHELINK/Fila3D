const Pedido = require('../src/domain/entities/Pedido');
const StatusPedido = require('../src/domain/entities/StatusPedido');

function criarPedido() {
  return new Pedido({
    id: 1,
    clienteId: 1,
    materialId: 1,
    descricao: 'Suporte de headset',
    pesoGramas: 120,
    tempoHoras: 3.5,
    valorTotal: 45,
  });
}

function pedidoComStatus(status) {
  const pedido = criarPedido();
  const caminho = {
    [StatusPedido.ORCAMENTO]: [],
    [StatusPedido.APROVADO]: ['aprovar'],
    [StatusPedido.IMPRIMINDO]: ['aprovar', 'iniciarImpressao'],
    [StatusPedido.CONCLUIDO]: ['aprovar', 'iniciarImpressao', 'concluir'],
    [StatusPedido.ENTREGUE]: [
      'aprovar',
      'iniciarImpressao',
      'concluir',
      'entregar',
    ],
    [StatusPedido.CANCELADO]: ['cancelar'],
  };
  caminho[status].forEach((acao) => pedido[acao]());
  return pedido;
}

describe('Pedido - fluxo de status', () => {
  describe('criação', () => {
    it('deve nascer com status ORCAMENTO', () => {
      expect(criarPedido().status).toBe(StatusPedido.ORCAMENTO);
    });

    it('deve guardar os dados informados', () => {
      const pedido = criarPedido();
      expect(pedido.clienteId).toBe(1);
      expect(pedido.materialId).toBe(1);
      expect(pedido.descricao).toBe('Suporte de headset');
      expect(pedido.pesoGramas).toBe(120);
      expect(pedido.tempoHoras).toBe(3.5);
      expect(pedido.valorTotal).toBe(45);
      expect(pedido.criadoEm).toBeInstanceOf(Date);
    });
  });

  describe('transições válidas', () => {
    it('aprovar: ORCAMENTO -> APROVADO', () => {
      const pedido = pedidoComStatus(StatusPedido.ORCAMENTO);
      pedido.aprovar();
      expect(pedido.status).toBe(StatusPedido.APROVADO);
    });

    it('iniciarImpressao: APROVADO -> IMPRIMINDO', () => {
      const pedido = pedidoComStatus(StatusPedido.APROVADO);
      pedido.iniciarImpressao();
      expect(pedido.status).toBe(StatusPedido.IMPRIMINDO);
    });

    it('concluir: IMPRIMINDO -> CONCLUIDO', () => {
      const pedido = pedidoComStatus(StatusPedido.IMPRIMINDO);
      pedido.concluir();
      expect(pedido.status).toBe(StatusPedido.CONCLUIDO);
    });

    it('entregar: CONCLUIDO -> ENTREGUE', () => {
      const pedido = pedidoComStatus(StatusPedido.CONCLUIDO);
      pedido.entregar();
      expect(pedido.status).toBe(StatusPedido.ENTREGUE);
    });

    it('cancelar: ORCAMENTO -> CANCELADO', () => {
      const pedido = pedidoComStatus(StatusPedido.ORCAMENTO);
      pedido.cancelar();
      expect(pedido.status).toBe(StatusPedido.CANCELADO);
    });

    it('cancelar: APROVADO -> CANCELADO', () => {
      const pedido = pedidoComStatus(StatusPedido.APROVADO);
      pedido.cancelar();
      expect(pedido.status).toBe(StatusPedido.CANCELADO);
    });

    it('deve percorrer o fluxo completo até ENTREGUE', () => {
      const pedido = criarPedido();
      pedido.aprovar();
      pedido.iniciarImpressao();
      pedido.concluir();
      pedido.entregar();
      expect(pedido.status).toBe(StatusPedido.ENTREGUE);
    });
  });

  describe('transições inválidas', () => {
    it('deve lançar mensagem clara ao concluir um pedido em ORCAMENTO', () => {
      const pedido = pedidoComStatus(StatusPedido.ORCAMENTO);
      expect(() => pedido.concluir()).toThrow(
        'Transição inválida: não é possível concluir um pedido com status ORCAMENTO',
      );
    });

    it.each([
      [StatusPedido.ORCAMENTO, 'iniciarImpressao'],
      [StatusPedido.ORCAMENTO, 'concluir'],
      [StatusPedido.ORCAMENTO, 'entregar'],
      [StatusPedido.APROVADO, 'aprovar'],
      [StatusPedido.APROVADO, 'concluir'],
      [StatusPedido.APROVADO, 'entregar'],
      [StatusPedido.IMPRIMINDO, 'aprovar'],
      [StatusPedido.IMPRIMINDO, 'iniciarImpressao'],
      [StatusPedido.IMPRIMINDO, 'entregar'],
      [StatusPedido.IMPRIMINDO, 'cancelar'],
      [StatusPedido.CONCLUIDO, 'aprovar'],
      [StatusPedido.CONCLUIDO, 'iniciarImpressao'],
      [StatusPedido.CONCLUIDO, 'concluir'],
      [StatusPedido.CONCLUIDO, 'cancelar'],
    ])(
      'deve lançar erro em %s ao chamar %s (pula etapa ou repete)',
      (status, acao) => {
        const pedido = pedidoComStatus(status);
        expect(() => pedido[acao]()).toThrow(
          /^Transição inválida: não é possível/,
        );
        expect(() => pedido[acao]()).toThrow(`status ${status}`);
        expect(pedido.status).toBe(status);
      },
    );

    const acoes = [
      'aprovar',
      'iniciarImpressao',
      'concluir',
      'entregar',
      'cancelar',
    ];

    describe.each([StatusPedido.ENTREGUE, StatusPedido.CANCELADO])(
      'estado final %s',
      (status) => {
        it.each(acoes)('não deve aceitar %s', (acao) => {
          const pedido = pedidoComStatus(status);
          expect(() => pedido[acao]()).toThrow(
            /^Transição inválida: não é possível/,
          );
          expect(pedido.status).toBe(status);
        });
      },
    );
  });

  describe('podeSerExcluido', () => {
    it('deve ser true em ORCAMENTO', () => {
      expect(pedidoComStatus(StatusPedido.ORCAMENTO).podeSerExcluido()).toBe(
        true,
      );
    });

    it.each([
      StatusPedido.APROVADO,
      StatusPedido.IMPRIMINDO,
      StatusPedido.CONCLUIDO,
      StatusPedido.ENTREGUE,
      StatusPedido.CANCELADO,
    ])('deve ser false em %s', (status) => {
      expect(pedidoComStatus(status).podeSerExcluido()).toBe(false);
    });
  });
});
